import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonText,
  IonToolbar,
  PopoverController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipsisHorizontal, ellipsisVertical } from 'ionicons/icons';
import { PopoverPage } from '../about-popover/about-popover';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  styleUrls: ['./about.scss'],
  imports: [
    FormsModule,
    DatePipe,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonText,
  ],
  providers: [PopoverController],
})
export class AboutPage {
  conferenceDate = '2024-12-06';
  workshopDate = '2024-12-05';

  private popoverCtrl = inject(PopoverController);

  constructor() {
    addIcons({ ellipsisHorizontal, ellipsisVertical });
  }

  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: PopoverPage,
      event,
    });
    await popover.present();
  }
}
