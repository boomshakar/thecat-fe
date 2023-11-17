import { ArrowIcon, HeartIcon } from "../../../assets/icons";
import useFetch from "../../../hooks/useFetch";

type CatListType = {
  breeds: [];
  id?: string;
  url: string;
  width?: number;
  height?: number;
  sub_id?: string;
  created_at: Date;
  original_filename: string;
};

const UploadedCatListItem = ({ data }: { data?: CatListType }) => (
  <div className="cat_list_item">
    <div className="cat_list_item_img">
      <img src={data?.url} alt={data?.original_filename} />
    </div>
    <div className="cat_list_item_cta">
      <button className="upvote">
        <ArrowIcon type="upvote" />
        Up Vote
      </button>

      <button className="downvote">
        <ArrowIcon type="downvote" />
        Down Vote
      </button>
    </div>
    <button className="favourite_cat">
      <HeartIcon type="filled" />
    </button>
  </div>
);

export const UploadedCatList = () => {
  const { data, loading } = useFetch<CatListType[]>("/images/?limit=10&page=0&order=DESC");

  return (
    <section className="cat_list_sect text-center">
      <h2 className="cat_list_sect__title text-500">Uploaded Cat List</h2>
      <div className="cat_list">
        {loading ? <div>Loading ...</div> : data?.map((cat) => <UploadedCatListItem key={cat.id} data={cat} />)}
      </div>
    </section>
  );
};
