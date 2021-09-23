export interface ItaComuni {
  "_id": string;
  "nome": string;
  "regione": string;
  "provincia": string;
  "codiceCatastale": string;
  "cap": string;
  "coordinate": {
    "lat": number,
    "lng": number
  }
}
