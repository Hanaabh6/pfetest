from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from base import keyword_index_collection, things_collection
from main_auth import auth_router
from main_localisation import localisation_router
from main_borrow import borrow_router
from main_crud import crud_router
from main_notifications import notifications_router
from main_recherche import recherche_router
from dotenv import load_dotenv
import os

load_dotenv("bdd.env")

index_mot_cle_collection = keyword_index_collection

app = FastAPI()

def _cleanup_orphan_keywords_on_startup():
    """Nettoie automatiquement les mots-clés orphelins au démarrage."""
    try:
        all_keyword_thing_ids = list(keyword_index_collection.distinct("thingId"))
        orphan_thing_ids = []
        
        for thing_id in all_keyword_thing_ids:
            thing_id_clean = str(thing_id).strip()
            if not things_collection.find_one({"id": thing_id_clean}):
                orphan_thing_ids.append(thing_id_clean)
        
        if orphan_thing_ids:
            result = keyword_index_collection.delete_many({"thingId": {"$in": orphan_thing_ids}})
            print(f"🧹 Nettoyage au démarrage: {result.deleted_count} mots-clés orphelins supprimés")
    except Exception as e:
        print(f"⚠️  Erreur lors du nettoyage des mots-clés: {e}")

def _get_origins() -> list[str]:
    configured = os.getenv(
        "FRONTEND_ORIGINS",
        "http://127.0.0.1:5501,http://localhost:5501,http://127.0.0.1:5500,http://localhost:5500",
    )
    return [origin.strip() for origin in configured.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_get_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Nettoyage automatique au démarrage
_cleanup_orphan_keywords_on_startup()

app.include_router(localisation_router)
app.include_router(recherche_router)
app.include_router(auth_router)
app.include_router(borrow_router)
app.include_router(crud_router)
app.include_router(notifications_router)

@app.get("/")
def root():
    return {"message": "API is running"}



