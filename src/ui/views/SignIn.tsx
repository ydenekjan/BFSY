import React, { useState } from "react";
import { TextField, Button, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../utils/UserContext.tsx";

const SignIn = () => {
  const { setUser } = useUser();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    axios
      .post("/users/auth", formData)
      .then((res) => {
        setUser(res.data);
        navigate("/");
      })
      .catch(() => {
        setUser(null);
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
                autoComplete={"username"}
                onChange={({ target }) => {
                  setFormData({ ...formData, username: target.value });
                }}
                placeholder={"Přihlašovací jméno"}
                sx={{ width: 1 }}
              />
              <TextField
                type={"password"}
                value={formData.password}
                autoComplete={"current-password"}
                onChange={({ target }) => {
                  setFormData({ ...formData, password: target.value });
                }}
                placeholder={"Heslo"}
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
