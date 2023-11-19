import { ArrowIcon, HeartIcon } from "../assets/icons";
import type { Cat } from "../types";

export const UploadedCatListItem = ({
  data,
  handleCatFavouriteToggle,
  voteUpDownHandler,
  actionOnFav,
  loadingId,
}: {
  data: Cat;
  handleCatFavouriteToggle: (data: Cat) => void;
  voteUpDownHandler: (data: Cat, value: number) => void;
  actionOnFav: boolean;
  loadingId: boolean;
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
        <button className={`font-lato upvote${isVotedUp ? " active" : ""}`} onClick={() => voteUpDownHandler(data, 1)}>
          <ArrowIcon type="upvote" />
        </button>

        <button
          className={`font-jost downvote${isVotedDown ? " active" : ""}`}
          onClick={() => voteUpDownHandler(data, -1)}
        >
          <ArrowIcon type="downvote" />
        </button>
      </div>

      <div className="cat_list_item_score">
        <span className="text-center font-lato">
          Scores:&nbsp;&nbsp;<span className="score_value">{totalVotes}</span>
        </span>
      </div>

      <button className="favourite_cat" onClick={() => handleCatFavouriteToggle(data)}>
        <HeartIcon type={data.favourite.status ? "filled" : "default"} />
        {loadingId && actionOnFav ? (
          <div className="is-loading">
            <div className="is-loading-icon"></div>
          </div>
        ) : (
          <></>
        )}
      </button>
    </div>
  );
};
