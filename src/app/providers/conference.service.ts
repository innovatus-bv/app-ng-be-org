import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

import { Speaker, Talk } from '.';
import { ConferenceData, Session } from '../interfaces/conference.interfaces';
import { UserService } from './user.service';

const SPEAKERS_DATA_PATH = 'assets/data/speakers-final.json';
const TALKS_DATA_PATH = 'assets/data/talks-final.json';
const CONFERENCE_DATA_PATH = 'assets/data/conference.json';
@Injectable({
  providedIn: 'root',
})
export class ConferenceService {
  http = inject(HttpClient);
  user = inject(UserService);

  talks = toSignal(this.load<Talk[]>(TALKS_DATA_PATH), {
    initialValue: [],
  });

  speakers = toSignal(this.load<Speaker[]>(SPEAKERS_DATA_PATH), {
    initialValue: [],
  });

  load<T>(path: string) {
    return this.http.get<T>(path);
  }

  // processData(data: ConferenceData): ConferenceData {
  //   // just some good 'ol JS fun with objects and arrays
  //   // build up the data by linking speakers to sessions
  //   this.data = data;

  //   // loop through each day in the schedule
  //   this.data.schedule.forEach((day: ScheduleDay) => {
  //     // loop through each timeline group in the day
  //     day.groups.forEach((group: Group) => {
  //       // loop through each session in the timeline group
  //       group.sessions.forEach((session: Session) => {
  //         session.speakers = [];
  //         if (session.speakerNames) {
  //           session.speakerNames.forEach((speakerName: string) => {
  //             const speaker = this.data.speakers.find(
  //               (s: Speaker) => s.name === speakerName
  //             );
  //             if (speaker) {
  //               session.speakers.push(speaker);
  //               speaker.sessions = speaker.sessions || [];
  //               speaker.sessions.push(session);
  //             }
  //           });
  //         }
  //       });
  //     });
  //   });

  //   return this.data;
  // }

  getTimeline(
    dayIndex: number,
    queryText = '',
    excludeTracks: string[] = [],
    segment = 'all'
  ) {
    return this.talks();
  }

  filterSession(
    session: Session,
    queryWords: string[],
    excludeTracks: string[],
    segment: string
  ) {
    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach((queryWord: string) => {
        if (session.name.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }

    // if any of the sessions tracks are not in the
    // exclude tracks then this session passes the track test
    let matchesTracks = false;
    session.tracks.forEach((trackName: string) => {
      if (excludeTracks.indexOf(trackName) === -1) {
        matchesTracks = true;
      }
    });

    // if the segment is 'favorites', but session is not a user favorite
    // then this session does not pass the segment test
    let matchesSegment = false;
    if (segment === 'favorites') {
      if (this.user.hasFavorite(session.name)) {
        matchesSegment = true;
      }
    } else {
      matchesSegment = true;
    }

    // all tests must be true if it should not be hidden
    session.hide = !(matchesQueryText && matchesTracks && matchesSegment);
  }

  getSpeakers() {
    return this.speakers;
  }

  getTalks() {
    return this.talks;
  }

  getMap() {
    return this.load<ConferenceData>(CONFERENCE_DATA_PATH).pipe(
      map((data: ConferenceData) => data.map)
    );
  }
}
