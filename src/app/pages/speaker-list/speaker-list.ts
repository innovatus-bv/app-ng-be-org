import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { globe, logoGithub, logoLinkedin, logoX } from 'ionicons/icons';
import { ConferenceService } from '../../providers/conference.service';
@Component({
  selector: 'page-speaker-list',
  templateUrl: 'speaker-list.html',
  styleUrls: ['./speaker-list.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonItem,
    IonAvatar,
    IonLabel,
    IonCardContent,
    RouterLink,
    IonButton,
    IonIcon,
  ],
})
export class SpeakerListPage {
  private confData = inject(ConferenceService);

  speakers = this.confData.getSpeakers();

  constructor() {
    addIcons({ logoX, logoGithub, logoLinkedin, globe });
  }

  openExternalLink(url: string) {
    window.open(url, '_blank');
  }
}
