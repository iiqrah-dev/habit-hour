export type ActiveView = 
  | "home"
  | "quote"
  | "word"
  | "art"
  | "truth-or-dare"
  | "gratitude";

export interface GratitudeEntry {
  id: string;
  date: string;
  gratefulFor3: string[];
  peopleGratefulFor2: string[];
  bestThing1: string;
  feeling: string; // emoji or description
}

export interface ArtItem {
  id: string;
  url: string; // base64 or object URL
  title: string;
  date: string;
  caption?: string;
}
