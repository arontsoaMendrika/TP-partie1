<template>
  <!-- ion-page : l'enveloppe obligatoire de chaque page -->
  <ion-page>
    <!-- En-tête fixe en haut de l'écran -->
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Menu du jour</ion-title>
        <ion-searchbar v-model="recherche" placeholder="Rechercher un plat" :debounce="250" />
        <ion-segment v-model="categorieChoisie" scrollable @ion-change="charger">
          <ion-segment-button value="toutes"><ion-label>Tout</ion-label></ion-segment-button>
          <ion-segment-button v-for="c in categories" :key="c.id" :value="String(c.id)">
            <ion-label>{{ c.nom }}</ion-label>
          </ion-segment-button>
        </ion-segment>    
      </ion-toolbar>
    </ion-header>

    <!-- Zone qui défile -->
    <ion-content>
      <ion-refresher slot="fixed" @ion-refresh="rafraichir">
        <ion-refresher-content />
      </ion-refresher>
      <!-- 1. Chargement en cours -->
      <div v-if="chargement" class="ion-text-center ion-padding">
        <ion-spinner />
      </div>

      <!-- 2. Erreur -->
      <div v-else-if="erreur" class="ion-padding">
        <ion-text color="danger">
          <p>{{ erreur }}</p>
        </ion-text>
        <ion-button expand="block" @click="charger">Réessayer</ion-button>
      </div>

      <!-- 3. La liste des plats -->
      <ion-list v-else>
        <p v-if="platsFiltres.length === 0">
          Aucun plat ne correspond
        </p>
        <ion-item v-for="plat in platsFiltres" :key="plat.id" :router-link="`/tabs/menu/${plat.id}`">
          <!-- <a slot="end" :href="`/tabs/menu/${plat.id}`" @click.stop>lien a</a> -->
          <ion-label>
            <h2>{{ plat.nom }}</h2>
            <p>{{ plat.description }}</p>
            <p>{{ plat.categorie?.nom }}</p>
          </ion-label>
          <ion-text color="primary" style="font-weight: bold;">{{ formatAriary(Number(plat.prix)) }}</ion-text>
          <ion-badge v-if="!plat.disponible" color="secondary">Épuisé</ion-badge>
          <ion-button slot="end" fill="clear" :disabled="!plat.disponible"
            @click.stop.prevent="ajouterAuPanier(plat)">
            <ion-icon slot="icon-only" :icon="addCircleOutline" />
          </ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted , computed } from 'vue';
// import {onUnmounted} from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonSpinner, IonText, IonButton,IonBadge,
  IonSearchbar,IonSegment,IonSegmentButton,IonRefresher,IonRefresherContent,
  IonIcon,toastController,
} from '@ionic/vue';
import api from '@/services/api';
import { formatAriary } from '@/utils/format';
import { addCircleOutline } from 'ionicons/icons';
import { usePanier } from '@/composables/usePanier';
import type { Categorie,Plat } from '@/types/gargote';
import type { RefresherCustomEvent } from '@ionic/vue';
// import { useIonRouter } from '@ionic/vue';

// const ionRouter = useIonRouter();
// ionRouter.back();                       // revenir
// ionRouter.navigate('/tabs/commandes', 'forward', 'replace');
// import { onIonViewWillEnter, onIonViewDidLeave } from '@ionic/vue';

// onMounted(() => console.log('MENU onMounted'));
// onUnmounted(() => console.log('MENU onUnmounted'));
// onIonViewWillEnter(() => console.log('MENU ionViewWillEnter'));
// onIonViewDidLeave(() => console.log('MENU ionViewDidLeave'));

const plats = ref<Plat[]>([]);
const chargement = ref(true);
const erreur = ref<string | null>(null);
const recherche= ref('');
const categories =ref<Categorie[]>([]);
const categorieChoisie= ref('toutes');


const platsFiltres= computed(()=> 
{
    return plats.value.filter((plat) => 
    plat.nom.toLowerCase().includes(recherche.value.toLocaleLowerCase())
  );
});




async function charger() {
  chargement.value = true;
  erreur.value = null;
  try {
    const categorieId = 
    categorieChoisie.value === 'toutes' ? undefined : categorieChoisie.value;
    if(categorieChoisie.value === 'toutes'){
      plats.value = await api.getPlats();
    }
    else{
      plats.value = await api.getPlats(Number(categorieId));
    }
  } catch (e) {
    erreur.value = "Impossible de joindre l'API. Est-elle lancée ?";
    console.error(e);
  } finally {
    chargement.value = false;
  }
}

const { ajouter } = usePanier();

async function ajouterAuPanier(plat:Plat) {
  ajouter(plat);
  const toast = await toastController.create({
    message: `${plat.nom} ajouté au panier`,
    duration: 1500, position: 'top', color: 'secondary',
  });
  await toast.present();
}

async function rafraichir(event:RefresherCustomEvent) {
  await charger();
  event.target.complete();
}

// onMounted(charger);
onMounted(async() => {
    categories.value = await api.getCategories();
    await charger();
});
</script>
