import React, { useEffect, useState } from "react";
import { TextField, Button, Divider } from "@mui/material";
import users from "../../../../mockup_data/users.json";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    axios.get("/user/670542c083025116d2a833bb").then((res) => {
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      navigate("/");
    });
  };

  return (
    <div className={"w-screen flex flex-col items-center py-24"}>
      <div
        className={
          "h-min max-w-md w-3/4 bg-white rounded-3xl border-l-8 border-colors-primary py-12 px-16 shadow-xl"
        }
      >
        <form onSubmit={handleSubmit} className={"w-full"}>
          <div className={"flex flex-col items-center gap-6"}>
            <h1 className={"text-3xl w-full"}>Přihlášení</h1>

            <div className={"flex flex-col gap-2 w-full"}>
              <TextField
                autoFocus={true}
                value={formData.username}
                onChange={({ target }) => {
                  setFormData({ ...formData, username: target.value });
                }}
                placeholder={"Přihlašovací jméno"}
                sx={{ width: 1 }}
              />
              <TextField
                value={formData.password}
                onChange={({ target }) => {
                  setFormData({ ...formData, password: target.value });
                }}
                placeholder={"Heslo (nechte prázdné)"}
                disabled={true}
                sx={{ width: 1 }}
              />
            </div>
            <Divider orientation={"horizontal"} sx={{ width: 1 }} />
            <Button
              type={"submit"}
              sx={{ width: 1, height: "3.5rem" }}
              variant={"contained"}
            >
              Přihlásit se
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
