from datetime import datetime, timezone
import sys

from fastapi import APIRouter, HTTPException, Request

from ..base import things_collection, user_history_collection
from .main_auth import _get_user_from_token, _prune_user_history, extract_bearer_token
from ..notifications_service import create_notification

borrow_router = APIRouter(tags=["borrow"])


def _main_module():
    return sys.modules.get("main")


def _things_collection():
    module = _main_module()
    return getattr(module, "things_collection", things_collection) if module else things_collection


def _user_history_collection():
    module = _main_module()
    return getattr(module, "user_history_collection", user_history_collection) if module else user_history_collection


def _auth_user_checker():
    module = _main_module()
    return getattr(module, "_require_authenticated_user", None) if module else None


def _normalize_text(text: str) -> str:
    return str(text or "").strip().lower()


def _canonical_availability(status: str) -> str:
    s = _normalize_text(status)
    if s in {"active", "disponible", "in-stock", "instock"}:
        return "disponible"
    if s in {"en_utilisation", "en utilisation", "borrowed"}:
        return "en_utilisation"
    return "indisponible"


def _require_authenticated_user(request: Request) -> tuple[str, str]:
    main_checker = _auth_user_checker()
    if callable(main_checker) and main_checker is not _require_authenticated_user:
        return main_checker(request)

    token = extract_bearer_token(request)
    if not token:
        raise HTTPException(status_code=401, detail="Token manquant")

    user = _get_user_from_token(token)

    return str(user.id), str(getattr(user, "email", "") or "")


@borrow_router.get("/user/mes-objets")
def get_mes_objets(request: Request):
    user_id, _ = _require_authenticated_user(request)
    history = _user_history_collection()
    things = _things_collection()

    open_logs = list(
        history.find(
            {
                "user_id": user_id,
                "action": "EMPRUNT_DEBUT",
                "returned": False,
            }
        ).sort("created_at", -1)
    )

    result = []
    for log in open_logs:
        thing_id = str(log.get("thing_id") or "").strip()
        if not thing_id:
            continue

        thing = things.find_one({"id": thing_id}) or {}
        loc = thing.get("location") if isinstance(thing.get("location"), dict) else {}

        result.append(
            {
                "thing_id": thing_id,
                "name": thing.get("name") or log.get("thing_name") or "Objet",
                "type": thing.get("type") or thing.get("@type") or "-",
                "status": thing.get("status") or "inactive",
                "availability": thing.get("availability") or "en_utilisation",
                "location": {
                    "room": loc.get("room") or loc.get("name") or log.get("salle") or "-",
                    "x": loc.get("x", 0),
                    "y": loc.get("y", 0),
                    "z": loc.get("z", 0),
                },
                "taken_at": log.get("created_at") or "",
            }
        )

    return result


@borrow_router.post("/things/{thing_id}/prendre")
@borrow_router.post("/take/{thing_id}")
def prendre_objet(thing_id: str, request: Request):
    user_id, email = _require_authenticated_user(request)

    things = _things_collection()
    history = _user_history_collection()

    thing = things.find_one({"id": thing_id})
    if not thing:
        raise HTTPException(status_code=404, detail="Objet introuvable")

    availability = _canonical_availability(str(thing.get("availability") or thing.get("status") or ""))
    if availability != "disponible":
        raise HTTPException(status_code=400, detail="Objet non disponible")

    now = datetime.now(timezone.utc)
    now_iso = now.isoformat()
    room_name = ""
    loc = thing.get("location")
    if isinstance(loc, dict):
        room_name = str(loc.get("room") or loc.get("name") or "")

    history.insert_one(
        {
            "user_id": user_id,
            "email": email,
            "action": "EMPRUNT_DEBUT",
            "detail": f"Prise de {thing.get('name', 'objet')}",
            "status": "en_utilisation",
            "date": now.strftime("%d/%m/%Y %H:%M:%S"),
            "created_at": now_iso,
            "thing_id": thing_id,
            "thing_name": thing.get("name", ""),
            "salle": room_name,
            "returned": False,
        }
    )
    _prune_user_history(user_id)

    things.update_one(
        {"id": thing_id},
        {"$set": {"availability": "en_utilisation", "status": "inactive"}},
    )

    thing_name = str(thing.get("name") or "objet")
    create_notification(
        target_role="user",
        recipient_user_id=user_id,
        recipient_email=email,
        actor_user_id=user_id,
        actor_email=email,
        title="Objet pris",
        message=f"Vous avez pris {thing_name}.",
        notif_type="success",
        metadata={"thing_id": thing_id, "action": "take"},
    )
    create_notification(
        target_role="admin",
        actor_user_id=user_id,
        actor_email=email,
        title="Emprunt utilisateur",
        message=f"{email or user_id} a pris {thing_name}.",
        notif_type="info",
        metadata={"thing_id": thing_id, "action": "take", "user_id": user_id},
    )

    return {
        "success": True,
        "message": f"Vous avez pris {thing.get('name', 'objet')}",
        "timestamp": now_iso,
    }


@borrow_router.post("/things/{thing_id}/retourner")
@borrow_router.post("/return/{thing_id}")
def retourner_objet(thing_id: str, request: Request):
    user_id, email = _require_authenticated_user(request)

    things = _things_collection()
    history = _user_history_collection()

    open_log = history.find_one(
        {
            "thing_id": thing_id,
            "user_id": user_id,
            "action": "EMPRUNT_DEBUT",
            "returned": False,
        },
        sort=[("created_at", -1)],
    )
    if not open_log:
        raise HTTPException(status_code=400, detail="Aucun emprunt actif pour cet objet")

    start_raw = open_log.get("created_at")
    try:
        start_dt = datetime.fromisoformat(str(start_raw).replace("Z", "+00:00"))
    except Exception:
        start_dt = datetime.now(timezone.utc)

    end_dt = datetime.now(timezone.utc)
    duration_min = max(0, int((end_dt - start_dt).total_seconds() // 60))

    history.update_one(
        {"_id": open_log["_id"]},
        {
            "$set": {
                "returned": True,
                "returned_at": end_dt.isoformat(),
                "duree_minutes": duration_min,
            }
        },
    )

    thing = things.find_one({"id": thing_id}) or {}
    history.insert_one(
        {
            "user_id": user_id,
            "email": email,
            "action": "EMPRUNT_FIN",
            "detail": f"Retour de {thing.get('name', 'objet')}",
            "status": "disponible",
            "date": end_dt.strftime("%d/%m/%Y %H:%M:%S"),
            "created_at": end_dt.isoformat(),
            "thing_id": thing_id,
            "thing_name": thing.get("name", ""),
            "duree_minutes": duration_min,
        }
    )
    _prune_user_history(user_id)

    things.update_one(
        {"id": thing_id},
        {"$set": {"availability": "disponible", "status": "active"}},
    )

    thing_name = str(thing.get("name") or "objet")
    create_notification(
        target_role="user",
        recipient_user_id=user_id,
        recipient_email=email,
        actor_user_id=user_id,
        actor_email=email,
        title="Objet retourne",
        message=f"Vous avez retourne {thing_name}.",
        notif_type="success",
        metadata={"thing_id": thing_id, "action": "return", "duration_min": duration_min},
    )
    create_notification(
        target_role="admin",
        actor_user_id=user_id,
        actor_email=email,
        title="Retour utilisateur",
        message=f"{email or user_id} a retourne {thing_name} ({duration_min} min).",
        notif_type="info",
        metadata={"thing_id": thing_id, "action": "return", "duration_min": duration_min, "user_id": user_id},
    )

    return {
        "success": True,
        "message": f"Merci. Objet retourne apres {duration_min} minutes",
        "duree_minutes": duration_min,
    }