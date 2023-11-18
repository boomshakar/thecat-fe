import { useEffect } from "react";
import { Link } from "react-router-dom";
import { uuid } from "../utils";

export const Navigation = () => {
  useEffect(() => {
    // generate a random ID for use is not available
    const getUserId = localStorage?.getItem("boomcat-uid");
    if (!getUserId) {
      localStorage.setItem("boomcat-uid", uuid());
    }
  }, []);

  return (
    <nav className="navbar">
      <Link to={"/"}>Home</Link>
      <Link to={"/upload"}>Upload</Link>
    </nav>
  );
};
