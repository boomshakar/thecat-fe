import { useEffect, useState } from "react";
import { ArrowIcon, HeartIcon } from "../assets/icons";
import useFetch from "../hooks/useFetch";
import { Cat, CatVoteResult, FavouriteCatResult } from "../types";
import { mergeCatListData } from "../utils";

const UploadedCatListItem = ({
  data,
  handleCatFavouriteToggle,
  voteUpDownHandler,
}: {
  data: Cat;
  handleCatFavouriteToggle: (data: Cat) => void;
  voteUpDownHandler: (data: Cat, value: number) => void;
}) => {
  const isVotedUp = data.votes.userVoteValue === 1;
  const isVotedDown = data.votes.userVoteValue === -1;
  const totalVotes = data.votes.totalUpvotes - data.votes.totalDownvotes;

  return (
    <div className="cat_list_item">
      <div className="cat_list_item_img">
        <img src={data.url} alt={data.original_filename} />
      </div>

      <div className="cat_list_item_cta">
        <button
          className={`font-lato upvote${isVotedUp ? " active" : ""}`}
          onClick={() => voteUpDownHandler(data, 1)}
          // disabled={isVotedUp}
        >
          <ArrowIcon type="upvote" />
          {/* <span>{`${data.votes.totalUpvotes} ${data.votes.totalUpvotes > 1 ? "votes" : "vote"}`}</span> */}
        </button>

        <button
          className={`font-jost downvote${isVotedDown ? " active" : ""}`}
          onClick={() => voteUpDownHandler(data, -1)}
          // disabled={isVotedDown}
        >
          <ArrowIcon type="downvote" />
          {/* <span>{`${data.votes.totalDownvotes} ${data.votes.totalDownvotes > 1 ? "votes" : "vote"}`}</span> */}
        </button>
      </div>

      <div className="cat_list_item_score">
        <span className="text-center font-lato">
          Scores:&nbsp;&nbsp;<span className="score_value">{totalVotes}</span>
        </span>
      </div>

      <button className="favourite_cat" onClick={() => handleCatFavouriteToggle(data)}>
        <HeartIcon type={data.favourite.status ? "filled" : "default"} />
      </button>
    </div>
  );
};

export const UploadedCatList = () => {
  const [allCatImages, setAllCatImages] = useState<Cat[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { data: listOfCats } = useFetch<Cat[]>("/images/?limit=10&page=0&order=DESC");
  const { data: listOfFavouritedCats, triggerFetch: refetchListOfFavouritedCats } =
    useFetch<FavouriteCatResult[]>("/favourites");
  const { data: listOfCatVotes, triggerFetch: refetchListOfCatVotes } = useFetch<CatVoteResult[]>("/votes");

  const { triggerFetch: addToFavourite } = useFetch<FavouriteCatResult[]>("/favourites", false, {
    onSuccess: () => refetchListOfFavouritedCats(),
  });
  const { triggerFetch: removeFromFavourite } = useFetch<FavouriteCatResult[]>("/favourites", false, {
    onSuccess: () => refetchListOfFavouritedCats(),
  });
  const { triggerFetch: voteForACat } = useFetch<FavouriteCatResult[]>("/vote", false, {
    onSuccess: () => refetchListOfCatVotes(),
  });
  const { triggerFetch: removeFromVote } = useFetch<FavouriteCatResult[]>("/votes", false, {
    onSuccess: () => refetchListOfCatVotes(),
  });

  useEffect(() => {
    if (!!listOfCats && !!listOfFavouritedCats && !!listOfCatVotes) {
      setAllCatImages(mergeCatListData(listOfCats, listOfFavouritedCats, listOfCatVotes, setIsLoading));
    }
  }, [listOfCatVotes, listOfCats, listOfFavouritedCats]);

  const handleCatFavouriteToggle = ({ id, favourite }: Cat) => {
    if (!favourite.status) {
      addToFavourite({
        method: "POST",
        url: "/favourites",
        body: JSON.stringify({
          image_id: id,
          sub_id: "bala",
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
          sub_id: "bala",
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
            />
          ))
        )}
      </div>
    </section>
  );
};
