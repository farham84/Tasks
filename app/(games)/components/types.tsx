

export type Game = {
  id: number;
  name: string;
  rating: number;
  background_image: string;
  genres: { name: string }[];
};


export type GameCardType = {
  id: number;
  name: string;
  rating: number;
  ratings_count?: number | null; 
  background_image: string;
  genres: { name: string }[];
};




export type Genre = {
  id: number;
  name: string;
  slug: string;
};


export type GameDetails = {
  id: number;
  name: string;
  description_raw: string;
  background_image: string;
  background_image_additional: string;
  website: string;
  rating: number;
  ratings_count: number;
  released: string;
  playtime: number;
  platforms: { platform: { name: string; slug: string } }[];
  genres: { name: string }[];
  publishers: { name: string }[];
  metacritic: number;
};
