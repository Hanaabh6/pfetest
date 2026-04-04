"""
Script pour peupler et maintenir la collection keyword_index
avec les mots clés extraits des objets (things).

Utilise une stratégie de tokenization et de poids pour optimiser la recherche.
"""

from base import things_collection, keyword_index_collection
from main_localisation import normalize_text
from pymongo import InsertOne, UpdateOne, ReplaceOne
from collections import Counter
import re


def tokenize_text(text: str) -> list[str]:
    """Tokenize le texte en mots individuels."""
    if not text:
        return []
    
    # Normaliser et convertir en minuscules
    text = normalize_text(text)
    
    # Diviser par espaces et caractères spéciaux
    tokens = re.findall(r'\b[a-zàâäæçéèêëïîôöœùûüçñáéíóúâêô]+\b', text)
    
    # Filtrer les tokens trop courts (< 3 caractères) et trop longs (> 50)
    tokens = [t for t in tokens if 3 <= len(t) <= 50]
    
    return list(set(tokens))  # Retourner les tokens uniques


def extract_keywords_from_object(obj: dict) -> dict[str, int]:
    """
    Extrait les mots clés d'un objet avec des poids différents selon l'importance.
    
    Retourne: {mot: poids}
    """
    keywords_weight = {}
    
    # Poids des différents champs (nom est plus important que description)
    FIELD_WEIGHTS = {
        "name": 10,           # Très important
        "type": 8,            # Important
        "room": 5,            # Important
        "description": 3,     # Modéré
        "status": 2,          # Faible
    }
    
    # Traiter le nom (très important)
    if obj.get("name"):
        tokens = tokenize_text(obj["name"])
        for token in tokens:
            keywords_weight[token] = keywords_weight.get(token, 0) + FIELD_WEIGHTS["name"]
    
    # Traiter le type
    if obj.get("type"):
        tokens = tokenize_text(obj["type"])
        for token in tokens:
            keywords_weight[token] = keywords_weight.get(token, 0) + FIELD_WEIGHTS["type"]
    
    # Traiter la localisation
    location = obj.get("location", {})
    if isinstance(location, dict):
        if location.get("room"):
            tokens = tokenize_text(str(location["room"]))
            for token in tokens:
                keywords_weight[token] = keywords_weight.get(token, 0) + FIELD_WEIGHTS["room"]
    
    # Traiter la description (moins important)
    if obj.get("description"):
        tokens = tokenize_text(obj["description"])
        for token in tokens:
            keywords_weight[token] = keywords_weight.get(token, 0) + FIELD_WEIGHTS["description"]
    
    # Traiter le statut
    if obj.get("status"):
        tokens = tokenize_text(obj["status"])
        for token in tokens:
            keywords_weight[token] = keywords_weight.get(token, 0) + FIELD_WEIGHTS["status"]
    
    return keywords_weight


def rebuild_keyword_index():
    """Reconstruit l'index des mots clés à partir de zéro."""
    print("🔄 Reconstruction de l'index des mots clés...")
    
    try:
        # Effacer l'index existant
        print("  📊 Suppression de l'index existant...")
        keyword_index_collection.delete_many({})
        
        # Récupérer tous les objets
        things = list(things_collection.find({}))
        print(f"  📦 {len(things)} objets à traiter")
        
        # Préparer les opérations d'insertion
        operations = []
        keyword_stats = Counter()
        
        for thing in things:
            thing_id = str(thing.get("_id"))
            keywords_weight = extract_keywords_from_object(thing)
            
            for mot, poids in keywords_weight.items():
                keyword_stats[mot] += 1
                
                doc = {
                    "mot": mot,
                    "thingId": thing_id,
                    "poids": poids,
                    "frequence": 1,  # Commencer à 1
                    "object_name": thing.get("name", ""),
                }
                operations.append(InsertOne(doc))
        
        # Exécuter les insertions par batch
        if operations:
            print(f"  ✍️  Insertion de {len(operations)} documents...")
            result = keyword_index_collection.bulk_write(operations)
            print(f"  ✅ {result.inserted_count} documents insérés")
        
        print(f"\n📊 Statistiques des mots clés:")
        print(f"  • Nombre de mots clés uniques: {len(keyword_stats)}")
        print(f"  • Nombre total d'entrées: {len(operations)}")
        print(f"  • Top 10 mots clés:")
        for mot, count in keyword_stats.most_common(10):
            print(f"    - '{mot}': {count} fois")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Erreur: {e}")
        import traceback
        traceback.print_exc()
        return False


def update_keyword_for_object(thing_id: str, thing_data: dict):
    """Met à jour les mots clés pour un objet spécifique."""
    print(f"🔄 Mise à jour des mots clés pour l'objet: {thing_id}")
    
    try:
        # Supprimer les anciens mots clés
        deleted = keyword_index_collection.delete_many({"thingId": thing_id})
        print(f"  🗑️  {deleted.deleted_count} anciens mots clés supprimés")
        
        # Extraire et insérer les nouveaux
        keywords_weight = extract_keywords_from_object(thing_data)
        operations = []
        
        for mot, poids in keywords_weight.items():
            doc = {
                "mot": mot,
                "thingId": thing_id,
                "poids": poids,
                "frequence": 1,
                "object_name": thing_data.get("name", ""),
            }
            operations.append(InsertOne(doc))
        
        if operations:
            result = keyword_index_collection.bulk_write(operations)
            print(f"  ✅ {result.inserted_count} nouveaux mots clés insérés")
        else:
            print("  ℹ️  Aucun mot clé à insérer")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Erreur: {e}")
        return False


def get_index_statistics():
    """Affiche les statistiques de l'index des mots clés."""
    print("\n📊 Statistiques de l'index des mots clés:\n")
    
    try:
        total_docs = keyword_index_collection.count_documents({})
        unique_keywords = keyword_index_collection.distinct("mot")
        unique_things = keyword_index_collection.distinct("thingId")
        
        print(f"  📈 Nombre total d'entrées: {total_docs}")
        print(f"  🏷️  Nombre de mots clés uniques: {len(unique_keywords)}")
        print(f"  📦 Nombre d'objets indexés: {len(unique_things)}")
        
        # Top 15 mots clés
        top_keywords = list(keyword_index_collection.aggregate([
            {"$group": {"_id": "$mot", "count": {"$sum": 1}, "avg_poids": {"$avg": "$poids"}}},
            {"$sort": {"count": -1}},
            {"$limit": 15}
        ]))
        
        print(f"\n  🔝 Top 15 mots clés les plus fréquents:")
        for i, item in enumerate(top_keywords, 1):
            print(f"     {i}. '{item['_id']}': {item['count']} fois (poids moyen: {item['avg_poids']:.1f})")
        
        # Objets avec le plus de mots clés
        top_things = list(keyword_index_collection.aggregate([
            {"$group": {"_id": "$thingId", "count": {"$sum": 1}, "name": {"$first": "$object_name"}}},
            {"$sort": {"count": -1}},
            {"$limit": 10}
        ]))
        
        print(f"\n  🎯 Top 10 objets avec le plus de mots clés:")
        for i, item in enumerate(top_things, 1):
            print(f"     {i}. '{item['name']}': {item['count']} mots clés")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Erreur: {e}")
        return False


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        if command == "rebuild":
            rebuild_keyword_index()
        elif command == "stats":
            get_index_statistics()
        else:
            print(f"Commande inconnue: {command}")
            print("Commandes disponibles: rebuild, stats")
    else:
        print("Commandes disponibles:")
        print("  python populate_keywords.py rebuild  - Reconstruire l'index")
        print("  python populate_keywords.py stats    - Afficher les statistiques")

