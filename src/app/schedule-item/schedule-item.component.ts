import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonAvatar, IonItem, IonLabel } from '@ionic/angular/standalone';
import { isBefore, parse, subDays } from 'date-fns';
import { StartTimePipe } from '../pages/speaker-detail/startTime.pipe';
import { Talk } from '../providers';

@Component({
  selector: 'app-schedule-item',
  standalone: true,
  imports: [IonItem, IonLabel, IonAvatar, StartTimePipe, RouterLink],
  template: `<ion-item
    [routerLink]="['/app/tabs/schedule/session', talk().id]"
    [style]="{ '--background': type(), opacity: isPast() ? 0.6 : 1 }">
    <div>{{ talk().timeStart | startTime }}</div>
    <ion-label>
      <h3>{{ talk().name }}</h3>
      @if (talk().speakers.length > 0) {
      <ion-avatar>
        @for (speaker of talk().speakers; track speaker.id) {
        <div>{{ speaker.name }}</div>
        <img [src]="speaker.img" />
        }
      </ion-avatar>
      }
    </ion-label>
  </ion-item>`,
  styleUrl: './schedule-item.component.scss',
})
export class ScheduleItemComponent {
  talk = input.required<Talk>();

  type = computed(() =>
    this.talk().type === 'session'
      ? 'wheat'
      : this.talk().type === 'sponsor'
      ? 'lightcoral'
      : 'lightgray'
  );

  isPast = computed(() =>
    isBefore(
      parse(this.talk().timeStart, 'hh:mm aa', new Date()),
      subDays(new Date(), 1)
    )
  );
}
