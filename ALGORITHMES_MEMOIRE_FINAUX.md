# Algorithmes Finaux - Rapport Mémoire (Améliorés)

## Algorithme 1 : IndexerObjets
Cet algorithme construit un index inversé en extrayant et pondérant les mots-clés des objets afin d'optimiser la recherche, tout en garantissant l'intégrité des données.

**Entrées** : Collection `things`  
**Sortie** : Collection `keyword_index`

```
DÉBUT

    // Phase 1 : Nettoyage
    POUR CHAQUE objet DANS things FAIRE
        NettoyerAncienIndex(objet.id)
    FIN POUR

    // Phase 2 : Extraction et Analyse
    POUR CHAQUE objet DANS things FAIRE
        champs ← ExtraireChampsIndexables(objet.name (poids=3), objet.type (poids=2), objet.description (poids=1), objet.location.room (poids=2))
        motsCles ← AnalyserSemantique(champs)
    FIN POUR

    // Phase 3 : Calcul et Enregistrement
    POUR CHAQUE objet DANS things FAIRE
        frequences ← CalculerPoidsTermes(motsCles)  // fréquence × poids
        EnregistrerIndex(objet.id, frequences)
    FIN POUR

    VerifierIntegriteReferentielle()

FIN

 Pondération : name=3, type=2, description=1, room=2.
```

## Algorithme 2 : Recherche Contextuelle et Pondération Spatiale
Cet algorithme effectue une recherche contextuelle en combinant la pertinence textuelle, la proximité spatiale et d'autres critères de classement. Il identifie les objets candidats, calcule un score global multicritère, puis les ordonne afin de fournir les résultats les plus adaptés au contexte de l'utilisateur.

**Entrées** : requeteBrute (Chaîne), userLocation (Identifiant de zone)  
**Sortie** : listeResultats (Collection ordonnée d'objets)

```
DEBUT

    requeteNettoyee ← NormaliserTexte(requeteBrute)

    // Phase 1 : Pré-sélection des candidats
    SI EstVide(requeteNettoyee) ALORS
        candidats ← RecupererCatalogueComplet()
    SINON
        tokens ← AnalyserLexicale(requeteNettoyee)
        tokensEtendus ← EtendreParSynonymes(tokens) 
        candidats ← InterrogerIndexInverse(tokensEtendus)

        SI EstVide(candidats) ALORS
            candidats ← ExecuterRechercheFloue(requeteNettoyee) 
        FIN SI
    FIN SI

    // Phase 2 : Scoring multicritères
    POUR CHAQUE objet DANS candidats FAIRE
        scoreTextuel ← CalculerPertinence(objet, tokens)
        bonusSpatial ← EvaluerProximite(objet.location, userLocation)
        objet.scoreFinal ← scoreTextuel + bonusSpatial
    FIN POUR

    // Phase 3 : Tri final
    // Tri multicritère : priorité à même salle > distance ascendante > vues descendantes > scoreFinal décroissant > nom ascendant
    listeResultats ← TrierParPriorite(candidats)

    RETOURNER listeResultats

FIN

## Algorithme 3 : ClasserResultats
Cet algorithme permet de classer les résultats de recherche selon des critères tels que la proximité spatiale et la pertinence sémantique. Chaque objet reçoit un score global, puis les résultats sont triés afin d'afficher en priorité les objets les plus pertinents.

**Entrées** : liste_resultats (Collection d'objets), position_utilisateur ({x, y, z, salle})  
**Sortie** : resultats_tries (Collection ordonnée d'objets)

DEBUT

    // Phase 1 : Évaluation de proximité
    POUR CHAQUE objet DANS liste_resultats FAIRE
        prioriteSpatiale ← EvaluerProximite(objet, position_utilisateur)
    FIN POUR

    // Phase 2 : Attribution du score
    POUR CHAQUE objet DANS liste_resultats FAIRE
        scorePertinence ← CalculerScoreSemantique(objet)
        AttribuerScoreFinal(objet, prioriteSpatiale, scorePertinence)
    FIN POUR

    // Phase 3 : Tri final
    // Tri multicritère : priorité à même salle > distance ascendante > vues descendantes > scoreFinal décroissant > nom ascendant
    RETOURNER TrierParPriorite(liste_resultats)

FIN
