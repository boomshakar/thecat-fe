import type { Cat, CatVote, CatVoteResult, FavouriteCatResult } from "../types";

/**
 * Merges data from different lists (listOfCats, listOfFavouritedCats, listOfCatVotes)
 * into a single array of Cat objects.
 *
 * @param listOfCats - List of Cat objects.
 * @param listOfFavouritedCats - List of FavouriteCatResult objects.
 * @param listOfCatVotes - List of CatVoteResult objects.
 * @param setIsMerging - Optional state setter for setting loading state.
 * @returns Merged array of Cat objects.
 */
export const mergeCatListData = (
  listOfCats: Cat[],
  listOfFavouritedCats: FavouriteCatResult[],
  listOfCatVotes: CatVoteResult[],
  setIsMerging?: React.Dispatch<React.SetStateAction<boolean>>
): Cat[] => {
  // If setIsMerging is provided, set loading state to true
  setIsMerging && setIsMerging(true);

  // Retrieve the user ID from local storage
  const getUserId = localStorage?.getItem("boomcat-uid");
  // Initialize a map to store merged Cat objects
  const catMap = new Map<string, Cat>();

  // Merge listOfCats
  listOfCats.forEach((cat) => {
    const mergedCat: Cat = {
      ...cat,
      votes: { totalUpvotes: 0, totalDownvotes: 0, userVoteValue: null, voteId: null },
      favourite: { status: false },
    };
    // Create a mergedCat object with initial vote and favourite values
    catMap.set(cat.id, mergedCat);
  });

  // Merge listOfFavouritedCats
  listOfFavouritedCats.forEach((favourite) => {
    const cat = catMap.get(favourite.image_id);

    // If corresponding Cat exists, update the favourite status
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
