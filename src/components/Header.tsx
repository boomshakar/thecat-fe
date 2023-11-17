import leadBannerImg from "../assets/image/lead_home_banner.webp";

export const Header = () => {
  return (
    <header className="head_banner">
      <div className="head_banner_img">
        <img src={leadBannerImg} alt="lead-img" />
      </div>
      <div className="head_banner_content text-white text-center">
        <h1 className="font-lato font-700">TOYS FOR YOUR PET</h1>
        <p className="font-300">Style in handcrafts, made by professionals for you</p>
      </div>
    </header>
  );
};
