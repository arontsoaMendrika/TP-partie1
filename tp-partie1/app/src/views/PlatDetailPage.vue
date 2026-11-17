<template>
    <ion-page>
        <ion-header>
            <ion-toolbar color="primary">
                <ion-buttons slot="start">
                    <ion-back-button default-href="/tabs/menu" text="Menu" />
                </ion-buttons>
                <ion-title>Détails du plat</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content >
            <p v-if="chargement">Chargement du plat...</p>
            <p v-else-if="erreur">{{ erreur }}</p>
            <ion-card v-else-if="plat">
                <ion-card-header>
                    <ion-card-subtitle>{{ plat.categorie.nom }}</ion-card-subtitle>
                    <ion-card-title>{{ plat.nom }}</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <p v-if="plat.description">{{ plat.description }}</p>
                    <p v-if="plat.prix != null">{{ plat.prix }} Ar</p>
                </ion-card-content>
            </ion-card>
            <ion-button  v-if="plat" expand="block" :disabled="!plat.disponible" @click="ajouterEtRevenir">
                Ajouter au panier
            </ion-button>
        </ion-content>
    </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
     IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent,
     IonButtons, IonBackButton,IonButton,useIonRouter,

} from '@ionic/vue';

import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/services/api';
import { usePanier } from '@/composables/usePanier';

const route = useRoute();
const chargement = ref(true);
const plat = ref(null);
const erreur = ref(null);
const { ajouter } = usePanier();
const ionRouter = useIonRouter();

async function chargerPlat(){
    chargement.value = true;
    try{
    plat.value = await api.getPlat(route.params.id);
    }catch(e){
        erreur.value = 'Erreur lors du chargement du plat';
        console.error('Erreur lors du chargement du plat:', e);
    }finally{
        chargement.value = false;
    }
}

function ajouterEtRevenir(){
    ajouter(plat.value);
    ionRouter.back();

}

onMounted(async () => {
chargerPlat();
});
</script>