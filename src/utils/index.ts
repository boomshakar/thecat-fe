import type { Cat, CatVote, CatVoteResult, FavouriteCatResult } from "../types";

export const mergeCatListData = (
  listOfCats: Cat[],
  listOfFavouritedCats: FavouriteCatResult[],
  listOfCatVotes: CatVoteResult[],
  setIsMerging?: React.Dispatch<React.SetStateAction<boolean>>
): Cat[] => {
  setIsMerging && setIsMerging(true);
  const catMap = new Map<string, Cat>();

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
        status: cat.sub_id === "bala",
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
          // Calculate total votes with value === 1
          accumulator.totalUpvotes += vote.value === 1 && vote.image_id === cat.id ? 1 : 0;

          // Calculate total votes with value === -1
          accumulator.totalDownvotes += vote.value === -1 && vote.image_id === cat.id ? 1 : 0;

          // Calculate vote value for a specific sub_id
          if (vote.sub_id === "bala" && vote.image_id === cat.id) {
            accumulator.userVoteValue = vote.value;
          }

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
