import { ref, computed } from 'vue';
import type { LignePanier,Plat } from '@/types/gargote';

// Déclaré EN DEHORS de la fonction : un seul panier pour toute l'application
const lignes = ref<LignePanier[]>([]); // chaque ligne : { plat, quantite }

export function usePanier() {
  function ajouter(plat: Plat) {
    // TODO : si le plat est déjà dans le panier, quantite + 1,
    //        sinon ajouter une ligne { plat, quantite: 1 }
    
   const ligne = lignes.value.find(l => l.plat.id === plat.id);
   if(ligne){
     ligne.quantite++;
   } else {
     lignes.value.push({ plat, quantite: 1 });
   }
  }

  function changerQuantite(platId: number, delta: number) {
    // TODO : ajoute delta (+1 ou -1) à la quantité ;
    //        si la quantité tombe à 0, retirer la ligne
    const ligne = lignes.value.find(l => l.plat.id === platId);
    if(ligne){
      ligne.quantite += delta;
      if(ligne.quantite <= 0){
        lignes.value = lignes.value.filter(l => l.plat.id !== platId);
      }
    }
  }

  function vider() {
    lignes.value = [];
  }

  const nombreArticles = computed(() => lignes.value.reduce((somme,ligne) => somme + ligne.quantite,0)); // somme des quantites
  const total = computed(() => lignes.value.reduce((total,ligne) => total + Number(ligne.plat.prix)*ligne.quantite, 0)); // somme des prix * quantites

  return { lignes, ajouter, changerQuantite, vider, nombreArticles, total };
}
