import { ArrowIcon, HeartIcon } from "../../../assets/icons";

const UploadedCatListItem = () => (
  <div className="cat_list_item">
    <div className="cat_list_item_img">
      <img src="https://pater-store-demo.myshopify.com/cdn/shop/products/9.1.jpg?v=1679023320" alt="" />
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
  return (
    <section className="cat_list_sect text-center">
      <h2 className="cat_list_sect__title text-500">Uploaded Cat List</h2>
      <div className="cat_list">
        {Array.from({ length: 6 }).map((_val: unknown, i) => (
          <UploadedCatListItem key={i} />
        ))}
      </div>
    </section>
  );
};
