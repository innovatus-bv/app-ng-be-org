export interface Talk {
  name: string;
  description: string[];
  speakers: SpeakerShort[];
  keyTakeaways: string[];
  timeStart: string;
  timeEnd: string;
  tracks: any[];
  id: number;
  location: string;
  extractedFrom: string;
  type: string;
}

export interface SpeakerShort {
  id: number;
  name: string;
  img?: string;
}

export interface Speaker {
  id: number;
  name: string;
  description?: string;
  img?: string;
}
