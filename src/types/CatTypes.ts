export interface CatVote {
  totalUpvotes: number;
  totalDownvotes: number;
  userVoteValue: number | null;
}

export interface Cat {
  breeds: unknown[];
  id: string;
  url: string;
  width: number;
  height: number;
  sub_id: string;
  created_at: string;
  original_filename: string;
  breed_ids: null | string[];
  votes: CatVote;
  favourite: boolean;
}

export interface FavouriteCatResult {
  id: number;
  user_id: string;
  image_id: string;
  sub_id: string;
  created_at: string;
  image: {
    id: string;
    url: string;
  };
}

export interface CatVoteResult {
  id: number;
  image_id: string;
  sub_id: string | null;
  created_at: string;
  value: number;
  country_code: string;
  image: {
    id: string;
    url: string;
  };
}
