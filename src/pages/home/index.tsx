import { Header } from "../../components/Header";
import { UploadedCatList } from "./components/UploadedCatList";

export const Home = () => {
  return (
    <main className="homepage">
      <Header />
      <div className="homepage_content">
        <UploadedCatList />
      </div>
    </main>
  );
};
