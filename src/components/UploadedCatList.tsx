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
    onSuccess: () => {
      refetchListOfFavouritedCats();
      setImLoading({ id: [""] });
    },
  });
  const { triggerFetch: removeFromFavourite, loading: isRemovingFav } = useFetch<FavouriteCatResult[]>(
    "/favourites",
    false,
    {
      onSuccess: () => {
        refetchListOfFavouritedCats();
        setImLoading({ id: [""] });
      },
    }
  );
  const { triggerFetch: voteForACat } = useFetch<FavouriteCatResult[]>("/vote", false, {
    onSuccess: () => {
      refetchListOfCatVotes();
      setImLoading({ id: [""] });
    },
  });
  const { triggerFetch: removeFromVote } = useFetch<FavouriteCatResult[]>("/votes", false, {
    onSuccess: () => refetchListOfCatVotes(),
  });

  useEffect(() => {
    if (!!listOfCats && !!listOfFavouritedCats && !!listOfCatVotes) {
      setAllCatImages(mergeCatListData(listOfCats, listOfFavouritedCats, listOfCatVotes, setIsLoading));
    } // else possible handle errors
  }, [listOfCatVotes, listOfCats, listOfFavouritedCats]);

  const handleCatFavouriteToggle = ({ id, favourite }: Cat) => {
    setImLoading((prevData) => ({ id: [...prevData.id, id] }));
    const getUserId = localStorage?.getItem("boomcat-uid");
    if (!favourite.status) {
      addToFavourite({
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
      removeFromFavourite({
        url: `/favourites/${favourite.id}`,
        method: "DELETE",
      });
    }
  };

  const voteUpDownHandler = ({ id, votes }: Cat, value: number) => {
    const getUserId = localStorage?.getItem("boomcat-uid");
    if (votes.voteId && votes.userVoteValue === value) {
      removeFromVote({
        url: `/votes/${votes.voteId}`,
        method: "DELETE",
      });
    } else {
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
