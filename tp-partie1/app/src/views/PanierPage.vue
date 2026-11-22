<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Panier</ion-title>
        <ion-buttons slot="end">
          <ion-button v-if="lignes.length" @click="vider">Vider</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <template v-if="lignes.length === 0">
        <p><ion-text>Votre panier est vide.</ion-text></p>
        <ion-button router-link="/tabs/menu">Voir le menu</ion-button>
      </template>
      <ion-list v-else>
        <ion-item v-for="ligne in lignes" :key="ligne.plat.id">
          <ion-label>
            <h2>{{ ligne.plat.nom }}</h2>
            <p>{{ formatAriary(Number(ligne.plat.prix)) }} × {{ ligne.quantite }}</p>
          </ion-label>
          <ion-button slot="end" fill="clear" @click="changerQuantite(ligne.plat.id, -1)">
            <ion-icon slot="icon-only" :icon="removeCircleOutline" />
          </ion-button>
          <ion-button slot="end" fill="clear" @click="changerQuantite(ligne.plat.id, +1)">
            <ion-icon slot="icon-only" :icon="addCircleOutline" />
          </ion-button>
        </ion-item>

        <ion-item>
          <ion-label><h2>Total</h2></ion-label>
          <ion-text slot="end" color="primary">{{ formatAriary(total) }}</ion-text>
        </ion-item>
      </ion-list>
      <ion-input v-model="table" type="number" label="Numéro de table"
           label-placement="floating" fill="outline"
           :class="{ 'ion-invalid ion-touched': erreurTable }"
           :error-text="erreurTable" />
      <ion-button expand="block" class="ion-margin-top" :disabled="envoi" @click="confirmer">
        Envoyer la commande
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonText,
  IonButtons, IonButton, IonList, IonItem, IonLabel, IonIcon,
  IonInput, alertController,loadingController,useIonRouter,toastController,
} from '@ionic/vue';
import { addCircleOutline, removeCircleOutline } from 'ionicons/icons';
import { usePanier } from '@/composables/usePanier';
import { formatAriary } from '@/utils/format';
import { ref } from 'vue';
import api, {ErreurAPI} from '@/services/api';

const { lignes, changerQuantite, vider, total } = usePanier();
const ionRouter = useIonRouter();
const table = ref('');
const erreurTable = ref('');
const envoi = ref(false);

async function confirmer(){
  const alerte = await alertController.create({
    header: 'Confirmer la commande',
    message: `Table ${table.value} : ${formatAriary(total.value)}`,
    buttons: [
      { text: 'Annuler', role: 'cancel' },
      { text: 'Envoyer', role: 'confirm' },
    ],
  });
  await alerte.present();
  const { role } = await alerte.onDidDismiss();
  if (role === 'confirm') await envoyer();
}

async function envoyer(){
  erreurTable.value = '';
  envoi.value = true;

  const chargement = await loadingController.create({message:'Envoi de la commande'});
  await chargement.present();
  try{
     const commande = {
      table: Number(table.value),
      lignes: lignes.value.map((l) => ({plat_id: l.plat.id,quantite:l.quantite })),
     };

     const cree =await api.creerCommande(commande);
     vider();
     table.value='';
     const toast = await toastController.create({
        message: `Commande n° ${cree.id} envoyée`,
        duration:2000, position: 'top',color: 'success',
      });
      await toast.present();
      ionRouter.navigate('/tabs/commandes','forward','replace');
  }catch(e){
    // console.log(e.statut,e.message,e.details);
       if(e instanceof ErreurAPI && e.statut === 422 && e.details.table){
         erreurTable.value= e.details.table;
       }else{
          const message = e instanceof ErreurAPI ? e.message : 'Erreur inconnue';
          const toast=await toastController.create({
            message: message,
            duration: 2000, position:'top',color:'danger',
          });
          await toast.present();
       }
  }finally{
    await chargement.dismiss();
    envoi.value=false;
  }
}



</script>
