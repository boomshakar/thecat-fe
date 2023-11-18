import { Header } from "../../components/Header";
import { Navigation } from "../../components/Navigation";
import { UploadedCatList } from "../../components/UploadedCatList";

export const Home = () => {
  return (
    <main className="homepage">
      <Navigation />
      <Header />
      <div className="homepage_content">
        <UploadedCatList />
      </div>
    </main>
  );
};
