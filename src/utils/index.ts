import type { Cat, CatVote, CatVoteResult, FavouriteCatResult } from "../types";

export const mergeCatListData = (
  listOfCats: Cat[],
  listOfFavouritedCats: FavouriteCatResult[],
  listOfCatVotes: CatVoteResult[],
  setIsMerging?: React.Dispatch<React.SetStateAction<boolean>>
): Cat[] => {
  setIsMerging && setIsMerging(true);
  const catMap = new Map<string, Cat>();

  const getUserId = localStorage?.getItem("boomcat-uid");

  // Merge listOfCats
  listOfCats.forEach((cat) => {
    const mergedCat: Cat = {
      ...cat,
      votes: { totalUpvotes: 0, totalDownvotes: 0, userVoteValue: null, voteId: null },
      favourite: { status: false },
    };
    catMap.set(cat.id, mergedCat);
  });

  // Merge listOfFavouritedCats
  listOfFavouritedCats.forEach((favourite) => {
    const cat = catMap.get(favourite.image_id);

    if (cat) {
      cat.favourite = {
        status: favourite.sub_id === getUserId,
        id: favourite.id,
      };
    }
  });

  // Merge listOfCatVotes
  listOfCatVotes.forEach((vote, _index, array) => {
    const cat = catMap.get(vote.image_id);
    if (cat) {
      cat.votes = array.reduce(
        (accumulator: CatVote, vote) => {
          // Calculate vote value for a specific sub_id
          if (vote.sub_id === getUserId && vote.image_id === cat.id) {
            accumulator.userVoteValue = vote.value;
          }

          // Calculate total votes with value === 1
          accumulator.totalUpvotes += vote.value === 1 && vote.image_id === cat.id ? 1 : 0;

          // Calculate total votes with value === -1
          accumulator.totalDownvotes += vote.value === -1 && vote.image_id === cat.id ? 1 : 0;

          accumulator.voteId = vote.image_id === cat.id && vote.id ? vote.id : null;

          return accumulator;
        },
        { totalUpvotes: 0, totalDownvotes: 0, userVoteValue: null, voteId: null }
      );
    }
  });

  // Set loading to false when all loops are completed
  setIsMerging && setIsMerging(false);

  // Convert the Map values back to an array
  const result = Array.from(catMap.values());
  return result;
};

// Generate random string with the length of 5
export const uuid = () => Math.random().toString(36).slice(2, 7);
