from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from base import keyword_index_collection
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

app.include_router(localisation_router)
app.include_router(recherche_router)
app.include_router(auth_router)
app.include_router(borrow_router)
app.include_router(crud_router)
app.include_router(notifications_router)

@app.get("/")
def root():
    return {"message": "API is running"}



