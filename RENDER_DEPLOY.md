# Déploiement & Optimisations Render

## 1. Optimisations FastAPI (Performance)

### Ajouter compression + caching headers

Modifiez `backend/main.py` :

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZIPMiddleware

app = FastAPI()

# --- OPTIMISATIONS ---
# Compression gzip (réduit taille réponses)
app.add_middleware(GZIPMiddleware, minimum_size=1000)

# CORS pour frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # À restreindre en prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Caching headers pour assets statiques
@app.middleware("http")
async def add_cache_headers(request, call_next):
    response = await call_next(request)
    if request.url.path.endswith((".js", ".css", ".png", ".jpg", ".svg")):
        response.headers["Cache-Control"] = "public, max-age=3600"
    return response
```

### Optimiser requêtes MongoDB

- Exemple :
  ```python
  db.objects.create_index("name")
  db.keywords.create_index("keyword")
  ```

---

## 2. Configuration Render

### Variables d'environnement à ajouter dans Render Dashboard

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=xxxxx
PYTHON_VERSION=3.11
```

### Commande de démarrage (Render)

```
uvicorn main:app --host 0.0.0.0 --port $PORT --workers 4
```

### Health Check (optionnel, recommandé)

Ajouter endpoint dans `backend/main.py` :

```python
@app.get("/health")
async def health():
    return {"status": "ok"}
```

Puis dans Render → Settings → Health Check :
- **Health Check Path** : `/health`
- **Protocol** : `HTTP`

---

## 3. Séparation Frontend+Backend (optionnel, mais meilleur)

Si vous voulez déployer frontend sur Vercel/Render Static Site :

### Servir frontend depuis backend (simple)

```python
from fastapi.staticfiles import StaticFiles

app.mount("/", StaticFiles(directory="frontend", html=True), name="static")
```

### Ou déployer séparément
- **Backend** : Render (actuel : `https://pfetest-api.onrender.com`)
- **Frontend** : Vercel Statics ou Netlify (plus rapide pour JavaScript)

---

## 4. Checklist Déploiement

- [ ] Variables d'env configurées dans Render
- [ ] `requirements.txt` à jour (`pip freeze > requirements.txt`)
- [ ] Teste localement : `uvicorn main:app --reload`
- [ ] Push code → GitHub repo
- [ ] Render redéploie automatiquement (auto-build)
- [ ] Vérifiez logs Render pour erreurs
- [ ] Test API : `curl https://pfetest-api.onrender.com/health`

---

## 5. Troubleshooting

**Render "spinning" (déploiement lent)** :
- Vérifiez `requirements.txt` (dépendances lourdes ?)
- Réduisez dépendances inutiles
- Utilisez Python 3.11 (plus rapide que 3.10)

**Timeout requêtes MongoDB** :
- Augmentez timeout dans code : `timeout=5000`
- Vérifiez index MongoDB Atlas

**CORS errors** :
- Vérifiez `allow_origins` dans CORSMiddleware
- En prod, remplacez `["*"]` par IP Render/domaine frontend

---

## 6. Monitoring

Render Dashboard → Metrics :
- CPU, Memory, Requests
- Si Memory > 500MB, optimisez requêtes MongoDB

---

**Prêt à déployer ?** Push code + vérifiez Render logs !
