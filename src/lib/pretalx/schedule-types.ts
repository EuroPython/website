export type Response = {
  slots: Slot[];
  version: string;
  breaks: Break[];
};

export type Slot = {
  code: string;
  speakers: Speaker[];
  title: string;
  submission_type: Translated;
  submission_type_id: number;
  track?: Translated;
  track_id?: number;
  state: string;
  abstract: string;
  description: string;
  duration: number;
  slot_count: number;
  do_not_record: boolean;
  is_featured: boolean;
  content_locale: string;
  slot: Slot2;
  image: any;
  resources: Resource[];
};

export type Speaker = {
  code: string;
  name: string;
  biography: string;
  avatar?: string;
};

export type Translated = {
  en: string;
};

export type Slot2 = {
  room_id: number;
  room: Translated;
  start: string;
  end: string;
};

export type Resource = {
  resource: string;
  description: string;
};

export type Break = {
  room: Translated;
  room_id: number;
  start: string;
  end: string;
  description: Translated;
};
