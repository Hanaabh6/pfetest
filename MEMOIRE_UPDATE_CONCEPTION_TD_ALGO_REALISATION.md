# Rapport - Conception, Thing Description, Algorithmes et Realisation

Ce chapitre presente les principaux elements relatifs a la conception et a la realisation du systeme developpe. Il met en evidence l'organisation generale de l'application, la place de la Thing Description dans le projet, les principaux algorithmes mobilises ainsi que les choix techniques qui ont permis d'aboutir a une solution fonctionnelle. L'objectif est de proposer une presentation claire, synthetique et academique, en restant fidele au travail reellement realise dans l'application.

## 1. Conception du systeme

### 1.1. Architecture generale

Le systeme concu repose sur une architecture web organisee autour de deux couches principales. La premiere couche correspond a l'interface utilisateur. Elle permet l'acces aux differentes fonctionnalites de l'application, notamment la consultation des objets, la recherche, la visualisation de la localisation, ainsi que l'execution des actions autorisees selon le profil de l'utilisateur. La seconde couche correspond au serveur applicatif, charge de traiter les requetes, d'assurer les controles necessaires et d'interagir avec les sources de donnees.

Cette separation entre la couche de presentation et la couche de traitement permet d'assurer une meilleure lisibilite du systeme. Elle facilite egalement la maintenance de l'application, en distinguant clairement les elements relatifs a l'affichage des elements relevant de la logique metier et de la persistance.

### 1.2. Organisation des donnees

Le systeme s'appuie sur une organisation hybride des donnees. Supabase est utilise pour la gestion des utilisateurs, de l'authentification et des roles. MongoDB est mobilise pour le stockage des donnees metier, en particulier les objets connectes, les mots-cles de recherche, l'historique des actions, les notifications et certaines informations techniques utiles au fonctionnement global de l'application.

Ce choix d'organisation permet d'adapter chaque technologie a un besoin precis. Les informations d'identification et d'acces sont ainsi distinguees des informations metier relatives aux objets et a leur exploitation. Une telle organisation contribue a rendre le systeme plus coherent et plus simple a administrer.

### 1.3. Organisation fonctionnelle

Sur le plan fonctionnel, la conception du systeme s'articule autour de plusieurs ensembles complementaires. Un premier ensemble est consacre a l'authentification et a la gestion des droits d'acces. Un second ensemble concerne la gestion des objets, depuis leur consultation jusqu'a leur mise a jour. Un troisieme ensemble est dedie a la recherche d'objets, avec prise en compte de la pertinence textuelle et de la proximite. Un quatrieme ensemble prend en charge la localisation au sein du batiment. Enfin, d'autres fonctions assurent la gestion des emprunts, des retours, des notifications et du suivi des activites.

Cette organisation fonctionnelle permet d'obtenir un systeme structure autour de traitements distincts mais complementaires. Chaque module repond a une responsabilite bien precise, tout en participant a la coherence d'ensemble de l'application.

### 1.4. Place de la Thing Description

Dans le cadre de ce projet, la Thing Description est retenue comme une representation conceptuelle permettant de structurer les informations essentielles relatives a un objet connecte. Elle ne doit pas etre comprise ici comme une specification exhaustive du standard WoT, mais plutot comme une forme simplifiee de description organisee autour des donnees utiles au fonctionnement du systeme.

La TD joue ainsi un role de formalisation. Elle permet de presenter de maniere claire l'identification de l'objet, sa description generale, ses proprietes principales, ses actions disponibles, sa localisation et les regles d'acces qui lui sont associees. Cette approche permet d'integrer la logique des objets connectes dans le memoire tout en restant adaptee au niveau de detail attendu.

### 1.5. Principe general de fonctionnement

Le fonctionnement global du systeme peut etre resume comme une chaine de traitement continue entre l'utilisateur, l'interface, le serveur et les bases de donnees. L'utilisateur interagit d'abord avec l'interface afin d'acceder a une fonctionnalite. La requete est ensuite transmise au backend, qui applique les traitements necessaires selon la nature de l'action demandee. Le serveur interroge alors les sources de donnees appropriees, effectue les verifications requises, met a jour les informations si besoin, puis renvoie une reponse vers l'interface.

Cette logique generale assure le lien entre les besoins fonctionnels identifies lors de la conception et les traitements effectivement realises dans l'application.

## 2. Presentation minimale de la Thing Description

Dans ce memoire, la Thing Description est volontairement presentee sous une forme minimale afin de mettre en evidence les composants essentiels de la description d'un objet connecte sans entrer dans un niveau de detail excessif. Cette presentation reste suffisante pour montrer la structure generale adoptee dans le projet.

La TD minimale retenue repose sur les elements suivants :

| Element | Contenu retenu | Fonction assuree |
| --- | --- | --- |
| Identification | identifiant, nom, type | identifier l'objet dans le systeme |
| Description | description textuelle | presenter le role general de l'objet |
| Proprietes | statut, disponibilite | decrire l'etat courant de l'objet |
| Actions | consulter, prendre, retourner | representer les interactions principales |
| Localisation | salle, coordonnees | situer l'objet dans le batiment |
| Securite | controle d'acces | limiter l'utilisation selon le profil |

La structure generale peut etre resumee de la maniere suivante :

```text
Thing Description minimale
  Identification
  Description
  Proprietes
  Actions
  Localisation
  Securite
```

Cette presentation synthese est suffisante pour traduire le travail effectue dans l'application. Elle permet de montrer que les objets sont decrits selon une logique structuree, tout en restant conforme a une redaction de memoire sobre et claire.

## 3. Algorithmes principaux

Les algorithmes presentes dans cette partie sont rediges sous une forme simplifiee. L'objectif est de faire apparaitre la logique generale de traitement sans entrer dans les details d'implementation. Cette presentation correspond au niveau de description attendu dans un rapport de memoire.

### 3.1. Algorithme d'indexation des objets

```text
Algorithme IndexationDesObjets
DEBUT
  LireObjets()
  POUR CHAQUE objet FAIRE
    ExtraireDonneesIndexables(objet)
    ExtraireMotsCles(objet)
    CalculerPoids(objet)
    MettreAJourIndex(objet)
  FIN POUR
FIN
```

Cet algorithme permet de preparer les informations necessaires a la recherche en extrayant les donnees utiles, en generant les mots-cles pertinents et en mettant a jour l'index associe aux objets.

### 3.2. Algorithme de recherche d'objets

```text
Algorithme RechercheObjets
DEBUT
  LireRequeteUtilisateur()
  NormaliserRequete()
  ExtraireMotsCles()
  RechercherDansIndex()
  RechercherDansCollection()
  CalculerScore()
  CalculerProximite()
  ClasserResultats()
  RetournerResultats()
FIN
```

Cet algorithme traduit le fonctionnement general de la recherche. Il prend en compte la requete saisie, la recherche textuelle, la pertinence des resultats ainsi que la proximite entre l'utilisateur et l'objet recherche.

### 3.3. Algorithme de classement des resultats

```text
Algorithme ClassementDesResultats
DEBUT
  RecevoirResultats()
  EvaluerCorrespondanceSalle()
  EvaluerDistance()
  EvaluerPertinence()
  ClasserResultats()
  RetournerListeFinale()
FIN
```

Le classement final permet d'organiser les resultats en tenant compte de plusieurs criteres complementaires. Il ne repose donc pas uniquement sur la correspondance textuelle, mais egalement sur la dimension spatiale associee a l'environnement du batiment.

## 4. Realisation du systeme

### 4.1. Technologies utilisees

La realisation de l'application a mobilise plusieurs technologies web et logicielles. La partie frontend a ete developpee en HTML, CSS et JavaScript. L'utilisation de Tailwind CSS a permis d'ameliorer la structuration visuelle des interfaces et d'obtenir une presentation plus claire des pages destinees a l'administration et a l'utilisation courante du systeme.

La partie backend a ete realisee en Python avec FastAPI. Ce framework a permis de structurer les traitements metier sous forme de routes claires, d'organiser les services applicatifs et de faciliter les echanges entre le client et le serveur. L'environnement Python du projet regroupe egalement les dependances necessaires au fonctionnement de l'ensemble.

### 4.2. Gestion des donnees et des acces

La gestion des donnees s'appuie sur l'utilisation combinee de MongoDB et de Supabase. MongoDB intervient pour le stockage des objets, de l'index de recherche, des notifications, de l'historique ainsi que d'autres informations techniques liees au fonctionnement de l'application. Supabase est utilise pour l'authentification, la gestion des comptes et l'attribution des roles.

Cette organisation permet une repartition claire des responsabilites. Les informations relatives a l'identite et a la securite des utilisateurs sont traitees separement des informations metier relatives aux objets et a leurs interactions.

### 4.3. Fonctions realisees dans l'application

La realisation couvre plusieurs fonctions essentielles. Du cote de l'interface, des pages ont ete mises en place pour l'administration, la consultation des objets, la recherche, la localisation, les notifications et les parametres. Du cote serveur, plusieurs modules ont ete developpes pour assurer l'authentification, la gestion des objets, la recherche, la localisation, la gestion des emprunts et retours, ainsi que la production des notifications et l'enregistrement de l'historique.

La fonction de recherche occupe une place importante dans l'application. Elle repose sur l'exploitation d'un index de mots-cles et sur une logique de rapprochement textuel a l'aide de RapidFuzz. A cette dimension textuelle s'ajoute une dimension spatiale fondee sur les salles et les coordonnees, ce qui permet d'ameliorer le classement des resultats selon la proximite.

### 4.4. Organisation de l'implementation

L'implementation du backend est structuree autour de plusieurs routeurs FastAPI, chacun etant associe a une responsabilite fonctionnelle. Cette organisation a permis de separer clairement les traitements et de rendre le code plus lisible. La partie frontend est elle aussi organisee en plusieurs pages adaptees aux profils utilisateurs et aux differents services proposes par l'application.

La realisation integre egalement plusieurs mecanismes pratiques, notamment la normalisation des donnees textuelles pour la recherche, la mise a jour de l'index des mots-cles, le calcul de proximite spatiale, la gestion des notifications et la conservation de l'historique des actions effectuees dans le systeme.

### 4.5. Synthese de la realisation

La phase de realisation a permis de concretiser les choix formules lors de la conception. Les outils et technologies utilises ont rendu possible la mise en place d'une application coherente, combinant interface utilisateur, services backend, gestion des donnees, recherche d'objets, localisation et suivi des operations.

Ainsi, la realisation ne se limite pas a une simple mise en oeuvre technique. Elle constitue la traduction effective des besoins fonctionnels en un systeme exploitable, structure et adapte au contexte du projet.

## Conclusion

L'etude de la conception et de la realisation montre que le systeme developpe repose sur une organisation claire, aussi bien sur le plan fonctionnel que sur le plan technique. La Thing Description y occupe une place conceptuelle utile, tandis que les algorithmes retenus assurent les traitements essentiels lies a l'indexation, a la recherche et au classement. Enfin, la realisation traduit concretemement les choix de conception en une application operationnelle, capable de repondre aux besoins definis dans le cadre du projet.
