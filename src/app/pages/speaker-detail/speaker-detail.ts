import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import {
  ActionSheetController,
  Config,
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  callOutline,
  callSharp,
  globe,
  logoGithub,
  logoLinkedin,
  logoX,
  shareOutline,
  shareSharp,
} from 'ionicons/icons';
import { Speaker } from '../../providers';
import { ConferenceService } from '../../providers/conference.service';

@Component({
  selector: 'page-speaker-detail',
  templateUrl: 'speaker-detail.html',
  styleUrls: ['./speaker-detail.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonChip,
    IonLabel,
    NgOptimizedImage,
  ],
  providers: [InAppBrowser, ActionSheetController],
})
export class SpeakerDetailPage {
  config = inject(Config);
  speaker = computed(() =>
    this.confService
      .speakers()
      .find(
        (speaker) =>
          speaker.id === +this.route.snapshot.paramMap.get('speakerId')
      )
  );

  private confService = inject(ConferenceService);
  private route = inject(ActivatedRoute);
  private actionSheetCtrl = inject(ActionSheetController);
  private inAppBrowser = inject(InAppBrowser);

  constructor() {
    addIcons({
      callOutline,
      callSharp,
      shareOutline,
      shareSharp,
      logoGithub,
      logoX,
      logoLinkedin,
      globe,
    });
  }

  openExternalUrl(url: string) {
    this.inAppBrowser.create(url, '_blank');
  }

  async openSpeakerShare(speaker: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Share ' + speaker.name,
      buttons: [
        {
          text: 'Copy Link',
          handler: () => {
            console.log('Copy link clicked on ' + speaker.social.x);
            if (
              (window as any).cordova &&
              (window as any).cordova.plugins.clipboard
            ) {
              (window as any).cordova.plugins.clipboard.copy(speaker.social.x);
            }
          },
        },
        {
          text: 'Share via ...',
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  async openContact(speaker: Speaker) {
    const mode = this.config.get('mode');

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Contact ' + speaker.name,
      buttons: [
        // {
        //   text: `Email ( ${speaker.email} )`,
        //   icon: mode !== 'ios' ? 'mail' : null,
        //   handler: () => {
        //     window.open('mailto:' + speaker.email);
        //   },
        // },
        // {
        //   text: `Call ( ${speaker.phone} )`,
        //   icon: mode !== 'ios' ? 'call' : null,
        //   handler: () => {
        //     window.open('tel:' + speaker.phone);
        //   },
        // },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }
}
