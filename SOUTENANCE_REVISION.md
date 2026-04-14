# Guide De Revision Soutenance - IntelliBuild

## 1. Resume ultra-court du projet

### En 20 secondes
IntelliBuild est une plateforme Web de recherche, localisation et exploitation d'objets connectes dans un smart building. L'utilisateur peut rechercher un objet, voir ou il se trouve, l'emprunter, puis utiliser ses fonctionnalites si l'objet est reellement pilotable a distance.

### En 1 minute
Le projet combine:
- une interface Web admin pour publier et gerer les objets,
- une interface Web user pour rechercher, localiser et emprunter les objets,
- une API FastAPI pour la logique metier,
- MongoDB pour les objets, l'index de recherche, l'historique, les notifications et les devices,
- Supabase pour l'authentification et les roles,
- une simulation d'objets connectes sur Android via Termux et des mini serveurs REST.

L'idee forte est la suivante: un objet n'est pas seulement cherche par son nom, mais aussi par son type, sa description, sa salle, son statut et sa distance par rapport a l'utilisateur. Une fois l'objet emprunte, ses actions peuvent etre invoquees a distance via HTTP/REST.

## 2. Probleme que le projet resout

Dans un smart building, il peut y avoir beaucoup d'objets partages:
- imprimantes,
- capteurs,
- lampes,
- alarmes,
- cameras,
- objets de laboratoire.

Les difficultes principales sont:
- trouver rapidement le bon objet,
- savoir dans quelle salle il se trouve,
- savoir s'il est disponible,
- connaitre ses capacites,
- interagir avec lui simplement.

La solution proposee:
- centralise la description des objets,
- indexe les objets pour accelerer la recherche,
- tient compte de la localisation,
- permet l'emprunt et le retour,
- permet le pilotage distant de certains objets via le Web des objets.

## 3. Architecture globale

### Vue d'ensemble
1. L'admin ajoute un objet dans la plateforme.
2. L'objet est stocke dans MongoDB.
3. Des mots-cles sont generes pour alimenter l'index de recherche.
4. Le user recherche un objet.
5. L'API calcule les scores de pertinence et la distance.
6. Le user prend l'objet.
7. Si l'objet a un endpoint REST, le user peut executer des actions sur lui.
8. Des notifications et traces d'historique sont enregistrees.

### Composants principaux
- Frontend Web: HTML, CSS, JavaScript
- Backend API: FastAPI
- Base de donnees NoSQL: MongoDB
- Authentification et roles: Supabase
- Simulation IoT: Termux + petits serveurs REST sur Android
- Temps reel: WebSocket

## 4. Ce que le frontend fait

Le frontend est principalement en HTML/CSS/JavaScript natif.

### Pourquoi du JavaScript natif
- simple a deployer,
- pas de build complexe,
- facile a presenter en soutenance,
- controle direct des appels `fetch` vers l'API.

### Pages principales cote admin
- `frontend/index.html`
  Role: dashboard admin, statistiques, recherche rapide, consultation des objets.
- `frontend/ajouter-objet.html`
  Role: ajout d'un objet avec nom, type, salle, description, statut et endpoint REST.
- `frontend/objets.html`
  Role: gestion de l'inventaire, modification et suppression.
- `frontend/localisations.html`
  Role: visualisation des etages et salles.
- `frontend/notifications-admin.html`
  Role: lecture et gestion des notifications admin.
- `frontend/parametres.html`
  Role: profil admin, liste utilisateurs, suppression utilisateur.

### Pages principales cote user
- `frontend/user.html`
  Role: dashboard user, recherche et prise d'objet.
- `frontend/mesobjet.html`
  Role: liste des objets empruntes et controle distant lampe/alarme.
- `frontend/localisations-user.html`
  Role: choix de la salle utilisateur et position logique.
- `frontend/notifications-user.html`
  Role: notifications du user.
- `frontend/parametres-user.html`
  Role: profil, historique, langue.
- `frontend/login.html`, `frontend/register.html`, `frontend/reset.html`
  Role: authentification.

### Fichiers frontend transverses
- `frontend/config.js`
  Role:
  - definit `API_BASE`,
  - gere les toasts et confirmations,
  - gere les cartes de profil dans la sidebar,
  - synchronise certaines infos avec `localStorage`.
- `frontend/translations.js`
  Role: internationalisation FR / EN / AR.
- `frontend/ws-client.js`
  Role:
  - ouvre un WebSocket vers l'API,
  - gere la reconnexion automatique,
  - redistribue les evenements temps reel.

### Pourquoi `localStorage`
Il sert a stocker temporairement:
- le token utilisateur,
- le role,
- l'email,
- l'identite utilisateur,
- la langue,
- la salle et les coordonnees logiques de l'utilisateur.

Le jury peut demander: pourquoi `localStorage` ?
Reponse:
Parce qu'il permet de conserver l'etat de session et certaines preferences cote navigateur sans base locale supplementaire. C'est simple et suffisant pour ce PFE.

## 5. Ce que le backend fait

Le backend est structure en routeurs FastAPI.

### Fichier principal
- `backend/main.py`
  Role:
  - cree l'application FastAPI,
  - charge les variables d'environnement,
  - configure CORS,
  - active la compression GZip,
  - expose `/health`,
  - lance un nettoyage periodique de l'index,
  - charge tous les routeurs.

### Connexion base de donnees
- `backend/base.py`
  Role:
  - initialise MongoDB,
  - expose les collections:
    - `things`
    - `keyword_index`
    - `notifications`
    - `user_history`
    - `devices`
  - propose un mode degrade si MongoDB est indisponible.

### Routeur authentification
- `backend/routers/main_auth.py`
  Role:
  - login,
  - signup,
  - mot de passe oublie,
  - lecture du profil,
  - historique user,
  - listing users pour admin,
  - changement de role (désactivé via UI/API — géré centralement),
  - suppression utilisateur.

Pourquoi Supabase ici ?
- l'authentification et la gestion des comptes sont plus rapides a mettre en place,
- le projet se concentre sur la logique smart building,
- les roles sont centralises.

### Routeur CRUD objets
- `backend/routers/main_crud.py`
  Role:
  - ajout d'objet,
  - lecture d'un objet,
  - mise a jour,
  - suppression,
  - mise a jour du statut,
  - reindexation automatique.

Point important:
Lors de l'ajout d'un objet, si un `endpoint_url` est fourni, le backend genere automatiquement:
- `control`
- `device_state`
- `potentialAction`

Cela rapproche le modele de l'idee WoT.

### Routeur recherche
- `backend/routers/main_recherche.py`
  Role:
  - suggestions de recherche,
  - recherche complete,
  - increment du compteur de vues.

### Routeur localisation
- `backend/routers/main_localisation.py`
  Role:
  - contient les salles,
  - contient les coordonnees,
  - gere les alias de salles,
  - calcule distance et proximite.

### Routeur emprunt / usage
- `backend/routers/main_borrow.py`
  Role:
  - lister les objets pris,
  - prendre un objet,
  - retourner un objet,
  - envoyer les actions distantes `on/off`,
  - enregistrer l'historique,
  - notifier admin et user,
  - diffuser des evenements WebSocket.

### Routeur notifications
- `backend/routers/main_notifications.py`
  Role:
  - lire les notifications,
  - compter les notifications non lues,
  - marquer lu,
  - tout marquer lu,
  - envoyer des notifications,
  - notifier qu'un objet est proche.

### Routeur devices
- `backend/routers/main_devices.py`
  Role:
  - enregistrer un telephone/device et son IP,
  - garder un `last_seen`,
  - permettre a l'admin de lister les devices.

### Routeur WebSocket
- `backend/routers/main_ws.py`
  Role:
  - expose `/ws`,
  - authentifie optionnellement par token,
  - pousse les evenements temps reel.

- `backend/ws_manager.py`
  Role:
  - garde la liste des sockets actives,
  - diffuse un evenement JSON a tous les clients connectes.

## 6. Base de donnees et modele de donnees

### MongoDB

#### Collection `things`
Contient les objets connectes ou partageables.

Champs importants:
- `id`
- `name`
- `type`
- `description`
- `status`
- `availability`
- `location`
- `view_count`
- `control`
- `device_state`
- `potentialAction`

#### Collection `keyword_index`
Contient l'index de recherche.

Champs importants:
- `mot`
- `thingId`
- `poids`
- `source`
- `frequence`

#### Collection `user_history`
Contient les actions utilisateur:
- prise,
- retour,
- action sur objet,
- session,
- historique admin selon pages.

#### Collection `notifications`
Contient les notifications user/admin.

#### Collection `devices`
Contient les telephones ou devices enregistres:
- `device_id`
- `ip`
- `hostname`
- `metadata`
- `last_seen`

### Supabase
Utilise surtout:
- l'auth,
- la table `utilisateur`,
- les roles `admin` / `user`.

## 7. Algorithmes importants a connaitre

### 7.1 Normalisation du texte
But:
- eviter les problemes d'accents,
- rendre la recherche plus tolereante.

Principe:
- on passe en minuscules,
- on supprime les accents,
- on nettoie les espaces.

Pourquoi ?
Pour que `imprimante`, `Imprimante` et `IMPRIMANTE` soient traites pareil.

### 7.2 Indexation des objets
Dans `main_crud.py`, lors d'un ajout ou d'une modification:
- on extrait les mots du nom,
- du type,
- de la description,
- de la salle.

Poids utilises:
- TITRE = 3
- TYPE = 2
- SALLE = 2
- DESCRIPTION = 1

Pourquoi ?
Parce que le nom d'objet est plus important que la description.

### 7.3 Algorithme de recherche
Il combine plusieurs idees:

1. Normalisation de la requete.
2. Decoupage en tokens.
3. Expansion par synonymes.
   Exemples:
   - `lamp` -> `eclairage`
   - `printer` -> `imprimante`
   - `sensor` -> `capteur`
4. Lecture de l'index `keyword_index`.
5. Preselection MongoDB avec des regex sur:
   - nom,
   - type,
   - description,
   - disponibilite,
   - salle.
6. Score flou avec `RapidFuzz.partial_ratio`.
7. Validation logique:
   - correspondance des tokens,
   - correspondance du statut,
   - score flou au-dessus d'un seuil,
   - ou score index > 0.
8. Tri final.

### 7.4 Tri final des resultats
L'ordre de tri est:
1. meme salle en premier,
2. plus petite distance,
3. plus grand nombre de vues,
4. plus grand score de recherche,
5. ordre alphabetique.

Pourquoi ce tri ?
- on privilegie les objets les plus proches,
- puis les plus populaires,
- puis les plus pertinents textuellement.

### 7.5 Calcul de distance
Le projet n'utilise pas une vraie distance GPS.
Il utilise une distance logique sur une grille de salles et d'etages.

Idee:
- les salles ont des coordonnees `(x, y, z)`,
- `z` represente l'etage,
- changer d'etage coute plus cher qu'une petite distance horizontale.

La formule donne donc une "distance de perception utilisateur".

Pourquoi c'est bien ?
Parce que dans un batiment, monter d'etage est souvent plus "loin" qu'avancer de quelques metres sur le meme niveau.

### 7.6 Emprunt / retour
#### Prise d'objet
1. verifier que le token est valide,
2. recuperer l'objet,
3. verifier qu'il est disponible,
4. enregistrer `EMPRUNT_DEBUT` dans l'historique,
5. passer l'objet en `en_utilisation`,
6. notifier le user et l'admin.

#### Retour d'objet
1. retrouver l'emprunt actif,
2. calculer la duree,
3. marquer l'ancien log comme `returned = True`,
4. inserer un log `EMPRUNT_FIN`,
5. repasser l'objet en `disponible`,
6. notifier.

### 7.7 Controle distant d'un objet
Quand un user clique `ON` ou `OFF`:
1. verifier qu'il a vraiment emprunte l'objet,
2. lire `control.actions.on/off`,
3. appeler l'endpoint distant,
4. en cas d'echec, tenter plusieurs variantes:
   - meme methode,
   - envoi JSON `{action: ...}`,
   - POST avec `{state: ...}`,
   - POST avec `{power: ...}`,
   - GET en dernier recours.
5. mettre a jour `device_state`,
6. enregistrer l'action dans l'historique,
7. envoyer une notification,
8. diffuser un evenement WebSocket.

Pourquoi les fallbacks ?
Parce que les objets simules ou reels peuvent exposer des API legerement differentes.

### 7.8 Notifications d'objet proche
Le backend evite le spam avec une logique de deduplication:
- si une notification "objet proche" a deja ete envoyee pour le meme objet dans les 30 dernieres minutes, on ne la renvoie pas.

### 7.9 WebSocket et temps reel
Le WebSocket est utilise pour:
- annoncer qu'une commande a ete envoyee,
- signaler qu'un device est injoignable,
- diffuser le changement d'etat d'un objet.

Le client JS:
- se reconnecte automatiquement,
- ecoute les types d'evenements,
- met a jour l'ecran.

## 8. Simulation IoT et objets reels

### Ce que fait Termux
Sur Android, Termux permet d'executer un mini serveur REST.

Exemple d'objet:
- lampe,
- alarme.

### Pourquoi cette solution a ete choisie
- faible cout,
- rapide a mettre en place,
- facile a montrer devant le jury,
- permet une vraie interaction physique.

### Architecture de la demo reelle
1. Le telephone lance `node server.js`.
2. Le serveur expose:
   - `/health`
   - `/actions/on`
   - `/actions/off`
3. L'admin enregistre l'endpoint dans la plateforme.
4. Le user emprunte l'objet.
5. Le user agit depuis l'app Web.
6. Le backend appelle le telephone.
7. Le telephone execute l'action.

### Limite a connaitre
Si la torche du telephone est allumee manuellement hors du serveur Termux, la plateforme ne peut pas toujours le detecter parfaitement.
Cette limite est normale avec une simulation Termux simple.

## 9. Langages, technologies, bibliotheques et packages

### 9.1 Langages utilises

| Langage / techno | Pourquoi il est utilise |
|---|---|
| Python | logique metier, API, recherche, CRUD, notifications |
| HTML5 | structure des pages Web |
| CSS3 | design et mise en forme |
| JavaScript | interactivite navigateur, appels API, WebSocket |
| JSON | format d'echange des donnees |
| REST / HTTP | communication standard client-serveur et serveur-objet |
| MongoDB | stockage flexible des objets et logs |
| Supabase | authentification et roles |
| Node.js | execution des serveurs IoT sur Android |

### 9.2 Packages Python utilises directement

| Package | Pourquoi |
|---|---|
| `fastapi` | creer l'API REST rapidement |
| `uvicorn` | executer l'application FastAPI |
| `starlette` | base ASGI et middleware sous FastAPI |
| `pydantic` | valider les donnees d'entree/sortie |
| `pymongo` | parler avec MongoDB |
| `requests` | appeler les objets distants en HTTP |
| `rapidfuzz` | recherche floue et calcul de similarite |
| `python-dotenv` | charger les variables d'environnement |
| `supabase` | communiquer avec Supabase |
| `PyJWT` | support JWT cote auth |
| `websockets` | support temps reel / WebSocket |
| `httpx` | gestion reseau utilisee autour de Supabase |
| `bson` | manipulation d'identifiants MongoDB |

### 9.3 Packages Python presents dans `requirements.txt`
Important:
Tous les packages ci-dessous ne sont pas utilises directement dans ton code. Une partie est installee parce qu'elle est necessaire au fonctionnement interne de FastAPI, Supabase, WebSockets ou MongoDB.

`annotated-doc`, `annotated-types`, `anyio`, `cachetools`, `certifi`, `cffi`, `charset-normalizer`, `click`, `colorama`, `cryptography`, `deprecation`, `dnspython`, `fastapi`, `fsspec`, `h11`, `h2`, `hpack`, `httpcore`, `httpx`, `hyperframe`, `idna`, `markdown-it-py`, `mdurl`, `mmh3`, `multidict`, `packaging`, `postgrest`, `propcache`, `pycparser`, `pydantic`, `pydantic_core`, `Pygments`, `pyiceberg`, `PyJWT`, `pymongo`, `pyparsing`, `pyroaring`, `python-dateutil`, `python-dotenv`, `RapidFuzz`, `realtime`, `requests`, `rich`, `six`, `starlette`, `storage3`, `StrEnum`, `strictyaml`, `supabase`, `supabase-auth`, `supabase-functions`, `tenacity`, `typing-inspection`, `typing_extensions`, `urllib3`, `uvicorn`, `websockets`, `yarl`, `zstandard`.

### 9.4 Bibliotheques frontend chargees par CDN

| Bibliotheque | Pourquoi |
|---|---|
| Tailwind CSS | accelerer la mise en page et les composants visuels |
| Font Awesome | afficher facilement les icones |
| Three.js | afficher la vue 3D / structure du batiment |
| OrbitControls | naviguer dans la scene 3D |
| Supabase JS | page de reinitialisation de mot de passe |

### 9.5 Packages / outils Android et Node.js

| Package / outil | Pourquoi |
|---|---|
| `termux-api` | acceder aux fonctions Android via Termux |
| `nodejs` | executer les serveurs objets sur le telephone |
| `express` | creer rapidement des routes REST pour la lampe/alarme |
| `termux-torch` | controler la torche |
| `termux-media-player` | jouer un son |
| `termux-vibrate` | vibration de l'alarme |

## 10. Pourquoi ces choix techniques

### Pourquoi FastAPI et pas Flask ?
- validation automatique avec Pydantic,
- documentation OpenAPI facile,
- bonne performance,
- code clair pour un PFE.

### Pourquoi MongoDB et pas une base relationnelle ?
- les objets IoT n'ont pas tous exactement la meme structure,
- certains objets ont des proprietes ou actions differentes,
- MongoDB est souple pour stocker des documents varies.

### Pourquoi Supabase en plus de MongoDB ?
- MongoDB stocke les objets et l'activite applicative,
- Supabase gere surtout l'authentification et les roles.

### Pourquoi REST ?
- simple,
- standard,
- comprehensible par le jury,
- bien adapte a la communication Web et WoT.

### Pourquoi WebSocket si on a deja REST ?
- REST sert aux requetes classiques,
- WebSocket sert a pousser des mises a jour temps reel sans recharger la page.

### Pourquoi Termux pour la demo ?
- transforme rapidement un telephone Android en objet connecte simulable,
- economique,
- convaincant en soutenance.

## 11. Questions probables du jury et reponses types

### Question: Quelle est l'idee principale du projet ?
Reponse:
Le projet vise a faciliter la recherche, la localisation, l'emprunt et l'exploitation d'objets connectes dans un smart building, en utilisant une approche Web et des mecanismes de recherche indexes.

### Question: Pourquoi parler de WoT ?
Reponse:
Parce que les objets sont exposes comme des ressources accessibles via le Web, avec des endpoints HTTP/REST, une description exploitable et des actions accessibles a distance.

### Question: Quelle est la difference entre IoT et WoT ?
Reponse:
L'IoT concerne surtout la connexion physique et reseau des objets. Le WoT ajoute une couche Web standardisee pour decrire, decouvrir et utiliser les objets de maniere uniforme.

### Question: Comment votre recherche est-elle optimisee ?
Reponse:
Elle combine un index de mots-cles ponderes, des synonymes, une recherche floue avec RapidFuzz et un tri par distance, popularite et pertinence.

### Question: Pourquoi calculer une distance logique et non GPS ?
Reponse:
Parce qu'on travaille dans un batiment interieur. Une distance logique fondee sur les salles et les etages est plus adaptee qu'une geolocalisation GPS.

### Question: Comment gerez-vous la disponibilite d'un objet ?
Reponse:
Lorsqu'un objet est pris, son `availability` passe a `en_utilisation`. Lorsqu'il est rendu, il repasse a `disponible`.

### Question: Comment garantissez-vous qu'un utilisateur ne pilote pas un objet qu'il n'a pas pris ?
Reponse:
Avant toute action distante, le backend verifie qu'un emprunt actif existe pour cet utilisateur et cet objet.

### Question: Que se passe-t-il si l'objet distant est injoignable ?
Reponse:
Le backend marque l'objet comme non joignable, retourne une erreur controlee et diffuse un evenement temps reel.

### Question: Quelle est la limite actuelle du systeme ?
Reponse:
La simulation Termux reste une simulation pratique de soutenance. L'etat manuel d'un telephone modifie hors du serveur local n'est pas toujours detecte parfaitement.

### Question: Que pourriez-vous ameliorer ?
Reponse:
- heartbeat automatique des devices,
- synchronisation d'etat plus forte,
- meilleure semantique WoT avec Thing Description complete,
- plus d'objets reels,
- securisation avancee,
- monitoring centralise.

## 12. Forces du projet

- architecture claire,
- separation admin / user,
- recherche intelligente,
- localisation logique adaptee au batiment,
- historique et notifications,
- support du temps reel,
- possibilite de pilotage reel d'objets simules sur Android.

## 13. Faiblesses / limites a assumer honnêtement

- simulation de certains objets via telephone et non via materiel industriel reel,
- detection d'etat manuel hors serveur non toujours parfaite,
- partie devices encore simple,
- securite perfectible pour une mise en production industrielle,
- certaines bibliotheques sont chargees par CDN et non bundlees.

## 14. Script de demo possible

### Scenario court
1. L'admin se connecte.
2. L'admin ajoute un objet lampe avec son endpoint REST.
3. Le user se connecte.
4. Le user choisit sa salle.
5. Le user recherche `lampe`.
6. Le systeme affiche les objets tries.
7. Le user prend la lampe.
8. Dans `Mes objets`, il clique sur `Allumer`.
9. La torche du telephone s'allume reellement.
10. Le user clique `Eteindre`.

### Phrase utile en soutenance
Nous ne faisons pas seulement de la recherche documentaire d'objets. Nous allons jusqu'a l'exploitation de l'objet connecte grace a une architecture Web et a une invocation REST de ses fonctionnalites.

## 15. Ce qu'il faut absolument savoir par coeur

- le but du projet,
- la difference entre IoT et WoT,
- pourquoi FastAPI,
- pourquoi MongoDB,
- pourquoi Supabase,
- comment fonctionne la recherche,
- comment fonctionne la localisation,
- comment fonctionne l'emprunt,
- comment fonctionne le controle distant,
- pourquoi Termux a ete utilise,
- quelles sont les limites et ameliorations.

## 16. Mini antisecches

### Si on te demande "c'est quoi FastAPI ?"
Framework Python moderne pour creer des API REST rapides avec validation automatique des donnees.

### Si on te demande "c'est quoi Pydantic ?"
Bibliotheque de validation de donnees en Python. Elle garantit que les donnees recues correspondent au modele attendu.

### Si on te demande "c'est quoi MongoDB ?"
Base NoSQL orientee documents. Elle est adaptee aux donnees heterogenes comme les objets connectes.

### Si on te demande "c'est quoi RapidFuzz ?"
Bibliotheque de similarite textuelle. Elle sert a comparer une requete avec des noms ou types meme s'il y a des fautes ou des variations.

### Si on te demande "c'est quoi WebSocket ?"
Canal bidirectionnel persistant entre client et serveur, utile pour les mises a jour temps reel.

### Si on te demande "c'est quoi Termux ?"
Environnement Linux leger sur Android permettant d'executer des scripts et services comme un petit serveur REST.

## 17. Conclusion personnelle a dire si besoin

Le projet montre qu'il est possible de combiner recherche intelligente, localisation et pilotage d'objets connectes dans un smart building en s'appuyant sur des technologies Web ouvertes. L'apport principal n'est pas seulement la gestion d'inventaire, mais surtout la capacite a decouvrir puis utiliser les objets de maniere simple et centralisee.
