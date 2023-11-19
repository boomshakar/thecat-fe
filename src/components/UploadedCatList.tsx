import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { Cat, CatVoteResult, FavouriteCatResult } from "../types";
import { mergeCatListData } from "../utils";
import { UploadedCatListItem } from "./UploadedCatListItem";

export const UploadedCatList = () => {
  const [allCatImages, setAllCatImages] = useState<Cat[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [imLoading, setImLoading] = useState({ id: [""] });

  const { data: listOfCats } = useFetch<Cat[]>("/images/?limit=10&page=0&order=DESC");
  const { data: listOfFavouritedCats, triggerFetch: refetchListOfFavouritedCats } =
    useFetch<FavouriteCatResult[]>("/favourites");
  const { data: listOfCatVotes, triggerFetch: refetchListOfCatVotes } = useFetch<CatVoteResult[]>("/votes");

  const { triggerFetch: addToFavourite, loading: isAddingFav } = useFetch<FavouriteCatResult[]>("/favourites", false, {
    onSuccess: () => refetchListOfFavouritedCats(),
  });

  const { triggerFetch: removeFromFavourite, loading: isRemovingFav } = useFetch<FavouriteCatResult[]>(
    "/favourites",
    false,
    {
      onSuccess: () => refetchListOfFavouritedCats(),
    }
  );

  const { triggerFetch: voteForACat } = useFetch<FavouriteCatResult[]>("/vote", false, {
    onSuccess: () => refetchListOfCatVotes(),
  });

  const { triggerFetch: removeFromVote } = useFetch<FavouriteCatResult[]>("/votes", false, {
    onSuccess: () => refetchListOfCatVotes(),
  });

  // Effect to merge cat data when all necessary data is available
  useEffect(() => {
    if (!!listOfCats && !!listOfFavouritedCats && !!listOfCatVotes) {
      setAllCatImages(mergeCatListData(listOfCats, listOfFavouritedCats, listOfCatVotes, setIsLoading));
    } // else possible handle errors
  }, [listOfCatVotes, listOfCats, listOfFavouritedCats]);

  // Handler for toggling cat favorites
  const handleCatFavouriteToggle = async ({ id, favourite }: Cat) => {
    setImLoading((prevData) => ({ id: [...prevData.id, id] })); // Show loading indicator for the specific cat

    // Get user ID from local storage
    const getUserId = localStorage?.getItem("boomcat-uid");

    try {
      if (!favourite.status) {
        // Add to favorites if not favorited
        await addToFavourite({
          method: "POST",
          url: "/favourites",
          body: JSON.stringify({
            image_id: id,
            sub_id: getUserId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        // Remove from favorites if already favorited
        await removeFromFavourite({
          url: `/favourites/${favourite.id}`,
          method: "DELETE",
        });
      }
    } finally {
      setImLoading((prevData) => ({ id: prevData.id.filter((data) => data !== id) })); // Hide loading indicator
    }
  };

  // Handler for voting on cat images
  const voteUpDownHandler = ({ id, votes }: Cat, value: number) => {
    const getUserId = localStorage?.getItem("boomcat-uid");

    if (votes.voteId && votes.userVoteValue === value) {
      // If already voted with the same value, remove the vote
      removeFromVote({
        url: `/votes/${votes.voteId}`,
        method: "DELETE",
      });
    } else {
      // Otherwise, vote with the specified value
      voteForACat({
        method: "POST",
        url: "/votes",
        body: JSON.stringify({
          image_id: id,
          sub_id: getUserId,
          value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  };

  return (
    <section className="cat_list_sect text-center">
      <h2 className="cat_list_sect__title text-500">Uploaded Cat List</h2>
      <div className="cat_list">
        {isLoading ? (
          <div>Loading ...</div>
        ) : (
          allCatImages?.map((cat) => (
            <UploadedCatListItem
              key={cat.id}
              data={cat}
              handleCatFavouriteToggle={handleCatFavouriteToggle}
              voteUpDownHandler={voteUpDownHandler}
              actionOnFav={isAddingFav || isRemovingFav}
              loadingId={imLoading.id.includes(cat.id)}
            />
          ))
        )}
      </div>
    </section>
  );
};
