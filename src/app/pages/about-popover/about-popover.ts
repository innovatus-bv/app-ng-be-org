import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonItem,
  IonLabel,
  IonList,
  PopoverController,
} from '@ionic/angular/standalone';

@Component({
  template: `
    <ion-list>
      <ion-item
        button
        (click)="close('https://ng-be.org/code-of-conduct')">
        <ion-label>Code of Conduct</ion-label>
      </ion-item>
      <ion-item
        button
        (click)="close('https://ng-be.org/rules-photo-contests')">
        <ion-label>Photo Contest Rules</ion-label>
      </ion-item>
      <ion-item
        button
        (click)="close('https://angular-jobs.com/')">
        <ion-label>Angular Jobs</ion-label>
      </ion-item>
      <ion-item
        button
        (click)="close('https://ng-be.org/')">
        <ion-label>Website</ion-label>
      </ion-item>
    </ion-list>
  `,
  imports: [IonList, IonItem, IonLabel],
  providers: [PopoverController],
})
export class PopoverPage {
  private router = inject(Router);
  private popoverCtrl = inject(PopoverController);

  support() {
    this.router.navigate(['/support']);
    this.popoverCtrl.dismiss();
  }

  close(url: string) {
    window.open(url, '_blank');
    this.popoverCtrl.dismiss();
  }
}
