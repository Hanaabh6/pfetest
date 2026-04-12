import asyncio
from typing import Any

from fastapi import WebSocket


class WSManager:
    """Manage active WebSocket connections and broadcast JSON events."""

    def __init__(self) -> None:
        self._connections: set[WebSocket] = set()
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        async with self._lock:
            self._connections.add(websocket)

    async def disconnect(self, websocket: WebSocket) -> None:
        async with self._lock:
            self._connections.discard(websocket)

    async def broadcast(self, event: dict[str, Any]) -> None:
        async with self._lock:
            sockets = list(self._connections)

        if not sockets:
            return

        stale: list[WebSocket] = []
        for websocket in sockets:
            try:
                await websocket.send_json(event)
            except Exception:
                stale.append(websocket)

        if stale:
            async with self._lock:
                for websocket in stale:
                    self._connections.discard(websocket)


ws_manager = WSManager()


def broadcast_event(event: dict[str, Any]) -> None:
    """Publish an event from sync or async contexts without blocking callers."""
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        asyncio.run(ws_manager.broadcast(event))
        return

    loop.create_task(ws_manager.broadcast(event))
