/*
 * Tous les appels à l'API passent par ce fichier.
 * Les pages n'utilisent jamais fetch() directement.
 */
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

import type {Categorie,Plat,NouvelleCommande,Commande} from '@/types/gargote';
/**
 * Envoie une requête et renvoie le JSON de la réponse.
 * En cas de code HTTP d'erreur (4xx, 5xx), lève une Error qui contient
 * le statut et le corps de la réponse (message, erreurs...).
 */
export class ErreurAPI extends Error{
constructor(
    message: string,
    public statut: number,
    public details: Record<string, string> = {},
  ) {
    super(message);
  }
}

async function requete<T>(chemin:string, options: RequestInit = {}):Promise<T> {
  const reponse = await fetch(BASE_URL + chemin, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const donnees = reponse.status === 204 ? null : await reponse.json();

  if (!reponse.ok) {
    const message = donnees?.message ?? `Erreur HTTP ${reponse.status}`;
    throw new ErreurAPI(message,reponse.status, donnees?.erreurs ?? {});
  }
  return donnees as T;
}


export default {
  getCategories(): Promise<Categorie[]> {
    return requete<Categorie[]>('/categories');
  },

  getPlats(categorieId?:number | null): Promise<Plat[]> {
    if (categorieId !== undefined && categorieId !== null) {
      return requete<Plat[]>(`/plats?categorie=${categorieId}`);
    }
    return requete<Plat[]>('/plats');
  },

  getPlat(id: number): Promise<Plat> {
    return requete<Plat>(`/plats/${id}`);
  },

  creerCommande(commande: NouvelleCommande):Promise<Commande> {
    return requete<Commande>('/commandes', { method: 'POST', body: JSON.stringify(commande) });
  },
  getCommandes(): Promise<Commande[]> {
    return requete<Commande[]>('/commandes');
  },

};
