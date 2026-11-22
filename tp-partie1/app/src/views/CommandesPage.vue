<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Commandes</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" @ion-refresh="rafraichir">            
        <ion-refresher-content />
      </ion-refresher>

      <p v-if="commandes.length === 0" class="ion-padding ion-text-center">         
        <ion-text color="medium">Aucune commande pour l'instant.</ion-text>
      </p>

      <!-- La liste des commandes -->
      <ion-list v-else>
        <ion-item v-for="c in commandes" :key="c.id">                 
          <ion-label>
            <h2>Commande n°{{ c.id }} · Table {{  c.table }}</h2>       
            <p>{{ formatDate(c.date) }}</p>                         
            <p>{{ c.lignes.map((l) => `${l.nom} × ${l.quantite}`).join(', ') }}</p>  
            <p><strong>{{ formatAriary(Number(c.total)) }}</strong></p>       
          </ion-label>
          <ion-badge slot="end" color="warning">{{ c.statut }}</ion-badge> 
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonText,
  IonList, IonItem, IonLabel, IonBadge, IonRefresher, IonRefresherContent,
  onIonViewWillEnter,
} from '@ionic/vue';
import api from '@/services/api';
import { formatAriary, formatDate } from '@/utils/format';
import type { Commande } from '@/types/gargote';
import type { RefresherCustomEvent } from '@ionic/vue';

const commandes = ref<Commande[]>([]);                  

async function charger() {
  try {
    commandes.value = await api.getCommandes();      
  } catch (e) {
    console.error(e);
  }
}

async function rafraichir(event:RefresherCustomEvent) {
  await charger();                            
  event.target.complete();                       
}

onIonViewWillEnter(charger);                               
</script>