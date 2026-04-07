from fastapi import APIRouter
import unicodedata

localisation_router = APIRouter(tags=["localisation"])

# Source unique de verite pour les salles + coordonnees
ROOM_DATA = {
    "Bureau PDG": {"x": 10, "y": 90, "z": 16},
    "Salle du Conseil": {"x": 20, "y": 90, "z": 16},
    "Salon VIP": {"x": 30, "y": 90, "z": 16},
    "Terrasse Privee": {"x": 40, "y": 90, "z": 16},
    "Secretariat": {"x": 50, "y": 90, "z": 16},
    "Archives Dir.": {"x": 60, "y": 90, "z": 16},
    "Open Space Alpha": {"x": 10, "y": 70, "z": 12},
    "Labo Robotique": {"x": 20, "y": 70, "z": 12},
    "Bureau Lead Dev": {"x": 30, "y": 70, "z": 12},
    "Salle Reunion 3A": {"x": 40, "y": 70, "z": 12},
    "Zone Debug": {"x": 50, "y": 70, "z": 12},
    "Serveurs 3": {"x": 60, "y": 70, "z": 12},
    "Studio Graphique": {"x": 10, "y": 50, "z": 8},
    "Bureau RH": {"x": 20, "y": 50, "z": 8},
    "Comptabilite": {"x": 30, "y": 50, "z": 8},
    "Salle de Presse": {"x": 40, "y": 50, "z": 8},
    "Bureau Com": {"x": 50, "y": 50, "z": 8},
    "Archives": {"x": 60, "y": 50, "z": 8},
    "Zone de Stockage": {"x": 10, "y": 30, "z": 4},
    "Atelier Reparation": {"x": 20, "y": 30, "z": 4},
    "Local Serveurs": {"x": 30, "y": 30, "z": 4},
    "Poste Securite": {"x": 40, "y": 30, "z": 4},
    "Quai d'Expedition": {"x": 50, "y": 30, "z": 4},
    "Bureau Chef": {"x": 60, "y": 30, "z": 4},
    "Accueil": {"x": 10, "y": 10, "z": 0},
    "Cafeteria": {"x": 20, "y": 10, "z": 0},
    "Showroom": {"x": 30, "y": 10, "z": 0},
    "Auditorium": {"x": 40, "y": 10, "z": 0},
    "Sanitaires": {"x": 50, "y": 10, "z": 0},
    "Espace Detente": {"x": 60, "y": 10, "z": 0},
}

ROOM_ALIASES = {
    "salle conseil": "Salle du Conseil",
    "terrasse": "Terrasse Privee",
    "terrasse privee": "Terrasse Privee",
    "open space": "Open Space Alpha",
    "bureau lead": "Bureau Lead Dev",
    "reunion 3a": "Salle Reunion 3A",
    "salle reunion 3a": "Salle Reunion 3A",
    "debug zone": "Zone Debug",
    "studio graph.": "Studio Graphique",
    "compta": "Comptabilite",
    "presse": "Salle de Presse",
    "stockage": "Zone de Stockage",
    "atelier": "Atelier Reparation",
    "serveurs 1": "Local Serveurs",
    "securite": "Poste Securite",
    "quai": "Quai d'Expedition",
    "detente": "Espace Detente",
    "cafeteria": "Cafeteria",
    "cafe": "Cafeteria",
    "cafeteria": "Cafeteria",
    "cafetaria": "Cafeteria",
}

ARCHI_DATA = [
    {
        "id": 4,
        "name": "Etage 4 - Direction",
        "color": 0xEF4444,
        "rooms": ["Bureau PDG", "Salle du Conseil", "Salon VIP", "Terrasse Privee", "Secretariat", "Archives Dir."],
    },
    {
        "id": 3,
        "name": "Etage 3 - Tech",
        "color": 0x3B82F6,
        "rooms": ["Open Space Alpha", "Labo Robotique", "Bureau Lead Dev", "Salle Reunion 3A", "Zone Debug", "Serveurs 3"],
    },
    {
        "id": 2,
        "name": "Etage 2 - Marketing",
        "color": 0xA855F7,
        "rooms": ["Studio Graphique", "Bureau RH", "Comptabilite", "Salle de Presse", "Bureau Com", "Archives"],
    },
    {
        "id": 1,
        "name": "Etage 1 - Logistique",
        "color": 0xF59E0B,
        "rooms": ["Zone de Stockage", "Atelier Reparation", "Local Serveurs", "Poste Securite", "Quai d'Expedition", "Bureau Chef"],
    },
    {
        "id": 0,
        "name": "RDC - Public",
        "color": 0x10B981,
        "rooms": ["Accueil", "Cafeteria", "Showroom", "Auditorium", "Sanitaires", "Espace Detente"],
    },
]


def normalize_text(text: str) -> str:
    if not text:
        return ""
    text = text.lower().strip()
    text = unicodedata.normalize("NFD", text)
    text = "".join(ch for ch in text if unicodedata.category(ch) != "Mn")
    return text


NORMALIZED_ROOM_DATA = {normalize_text(name): coords for name, coords in ROOM_DATA.items()}


_CANONICAL_BY_NORMALIZED = {}
for room_name in ROOM_DATA:
    _CANONICAL_BY_NORMALIZED[normalize_text(room_name)] = room_name


def canonical_room_name(room: str) -> str:
    room_raw = (room or "").strip()
    if not room_raw:
        return ""

    room_norm = normalize_text(room_raw)

    direct_match = _CANONICAL_BY_NORMALIZED.get(room_norm)
    if direct_match:
        return direct_match

    alias_target = ROOM_ALIASES.get(room_norm)
    if alias_target:
        return alias_target

    return room_raw


def coords_from_room(room: str) -> dict[str, float]:
    canonical = canonical_room_name(room)
    coords = ROOM_DATA.get(canonical)
    if coords:
        return {"x": float(coords["x"]), "y": float(coords["y"]), "z": float(coords["z"])}
    return {"x": 0.0, "y": 0.0, "z": 0.0}


def _compute_logical_distance(ux: float, uy: float, uz: float, ox: float, oy: float, oz: float) -> float:
    # Les coordonnees ROOM_DATA sont sur une grille de 10 unites (x/y) et 4 unites (z par etage).
    # On convertit en distance "logique" plus proche de la perception utilisateur:
    # - meme etage: petites distances (voisins proches)
    # - etages differents: penalite verticale forte et croissante.
    horizontal_units = ((ux - ox) ** 2 + (uy - oy) ** 2) ** 0.5
    horizontal_steps = horizontal_units / 10.0
    floor_steps = abs(uz - oz) / 4.0

    if floor_steps == 0:
        return horizontal_steps * 2.2

    vertical_penalty = floor_steps * 14.0
    horizontal_cross_floor = horizontal_steps * 0.9
    return vertical_penalty + horizontal_cross_floor


def compute_distance_and_room_flags(items: list[dict], user_x: float, user_y: float, user_z: float, user_room: str) -> None:
    user_room_canonical = canonical_room_name(user_room)
    user_room_norm = normalize_text(user_room_canonical)

    try:
        ux = float(user_x)
        uy = float(user_y)
        uz = float(user_z)
    except Exception:
        ux, uy, uz = 0.0, 0.0, 0.0

    # Si la salle utilisateur est connue, on privilegie toujours ses coordonnees canoniques.
    if user_room_canonical:
        user_coords = coords_from_room(user_room_canonical)
        if (user_coords["x"], user_coords["y"], user_coords["z"]) != (0.0, 0.0, 0.0):
            ux, uy, uz = user_coords["x"], user_coords["y"], user_coords["z"]

    for item in items:
        loc = item.get("location", {})
        loc_room = ""
        if isinstance(loc, dict):
            loc_room = str(loc.get("room", "")).strip()
        elif isinstance(loc, str):
            loc_room = loc.strip()
            loc = {"room": loc_room}
            item["location"] = loc
        else:
            loc = {}

        try:
            ox = float(loc.get("x", 0.0))
            oy = float(loc.get("y", 0.0))
            oz = float(loc.get("z", 0.0))
        except Exception:
            ox, oy, oz = 0.0, 0.0, 0.0

        obj_room = canonical_room_name(loc_room or str(loc.get("room", "")))
        same_room = bool(user_room_norm) and (normalize_text(obj_room) == user_room_norm)

        # On privilegie les coordonnees de la salle canonique pour eviter les x/y/z incoherents en base.
        if obj_room:
            room_coords = coords_from_room(obj_room)
            if (room_coords["x"], room_coords["y"], room_coords["z"]) != (0.0, 0.0, 0.0):
                ox, oy, oz = room_coords["x"], room_coords["y"], room_coords["z"]
        elif (ox, oy, oz) == (0.0, 0.0, 0.0) and loc_room:
            fallback = coords_from_room(loc_room)
            ox, oy, oz = fallback["x"], fallback["y"], fallback["z"]

        distance = _compute_logical_distance(ux, uy, uz, ox, oy, oz)

        item["distance"] = round(distance, 2)
        item["same_room"] = same_room


@localisation_router.get("/localisation/layout")
def get_localisation_layout():
    return {
        "floors": ARCHI_DATA,
        "room_coords": ROOM_DATA,
    }
