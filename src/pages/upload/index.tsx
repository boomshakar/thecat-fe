import leadBannerImg from "../../assets/image/lead_home_banner.webp";

import { CatImageUpload } from "../../components/CatImageUpload";
import { Navigation } from "../../components/Navigation";

export const Upload = () => {
  return (
    <main className="uploadpage">
      <Navigation />
      <div className="uploadpage_bg_img">
        <img src={leadBannerImg} alt="lead-img" />
      </div>
      <CatImageUpload />
    </main>
  );
};
