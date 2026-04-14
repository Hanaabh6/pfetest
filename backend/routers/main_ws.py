from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from .main_auth import _get_user_from_token
from ..ws_manager import ws_manager


ws_router = APIRouter(tags=["ws"])


@ws_router.websocket("/ws")
async def websocket_updates(websocket: WebSocket):
    token = str(websocket.query_params.get("token") or "").strip()
    user_id = ""
    email = ""

    if token:
        try:
            user = _get_user_from_token(token)
            user_id = str(getattr(user, "id", "") or "")
            email = str(getattr(user, "email", "") or "")
        except Exception:
            await websocket.close(code=1008)
            return

    await ws_manager.connect(websocket)

    await websocket.send_json(
        {
            "type": "ws_connected",
            "user_id": user_id,
            "email": email,
            "message": "WebSocket connecte",
        }
    )

    try:
        while True:
            message = await websocket.receive_text()
            if message.strip().lower() == "ping":
                await websocket.send_json({"type": "pong"})
    except WebSocketDisconnect:
        await ws_manager.disconnect(websocket)
    except Exception:
        await ws_manager.disconnect(websocket)
