export interface IndexArray {
  [key: string]: string | number | null;
}

export interface CountriesTypes extends IndexArray {
  id: number;
  name: string;
  iso3: string;
  iso2: string;
  phone_code: string;
  capital: string;
  currency: string;
  native: string | null;
  emoji: string | null;
  emojiU: string | null;
}
