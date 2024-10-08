import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <section
      className={
        "bg-colors-primary-dark h-24 w-full flex justify-between items-center shadow-xl px-12"
      }
    >
      <h1
        onClick={() => navigate("/")}
        className={"text-white text-2xl font-bold cursor-pointer"}
      >
        NÁKUPÁK
      </h1>
      <div
        onClick={() => navigate("/login")}
        className={" cursor-pointer flex items-center gap-4 text-xl text-white"}
      >
        <div>{JSON.parse(localStorage.getItem("currentUser")).fullName}</div>
        <Avatar />
      </div>
    </section>
  );
};

export default Navbar;
