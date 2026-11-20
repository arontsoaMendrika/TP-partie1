# Réponses — TP Gargote Mobile, partie 2 : de JavaScript à TypeScript

Nom et prénom :RAKOTONDRATSIMA Mendrika Arontsoa
Groupe :A

Répondez en quelques phrases, avec vos mots. Quand une question demande ce que
vous avez observé, décrivez ce que vous avez réellement vu à l'écran ou dans la console.

## Fiche 05 — Les problèmes

| Incident | Où l'erreur s'est-elle manifestée ? | Message affiché (s'il y en a un) | Temps pour trouver la cause |
|---|---|---|---|
| 1. Prix additionnés |dans la page de detail d'un plat | pas de message| 8 min|
| 2. Faute de frappe | dans la page du menu| tout les menus deviennent "épuisé" | 2 min|
| 3. API renommée | sur la page menu , dans la recherche , la page panier et la page detail du plat | le nom des produits ne s'affiche pas  | 15min|
| 4. Mauvais argument | dans la page panier | Nan (not a number) | 3min |
| 5. await oublié | page menu | toutes les plats ne s'affichent pas  | 2min |

- Q5.1 :Deux incidents ont produit une erreur claire (3 et 5). Trois étaient visibles seulement pour un utilisateur attentif (1, 2 et 4). L’incident 1 aurait pu passer inaperçu, car js concatène les prix sans afficher d’erreur.
- Q5.2 :J’ai modifié 5 endroits. Je les ai trouvés en testant les écrans puis en recherchant plat.nom. Une recherche de nom ne suffisait pas, car certains nom concernent les catégories ou les commandes et ne changent pas.
