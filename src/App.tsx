import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainView from "./ui/views/MainView.tsx";
import Navbar from "./ui/Navbar.tsx";
import ListOverview from "./ui/views/ListOverview.tsx";
import ListDetail from "./ui/views/ListDetail/ListDetail.tsx";
import SignIn from "./ui/views/SignIn.tsx";
import NewList from "./ui/views/ListDetail/NewList.tsx";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/";

function App() {
  return (
    <BrowserRouter>
      <div className={"w-screen h-screen"}>
        <Navbar />
        <Routes>
          <Route
            path={"/"}
            element={
              <MainView>
                <ListOverview />
              </MainView>
            }
          />
          <Route
            path={"/detail/:id"}
            element={
              <MainView>
                <ListDetail />
              </MainView>
            }
          />
          <Route
            path={"/novy"}
            element={
              <MainView>
                <NewList />
              </MainView>
            }
          />

          <Route path={"/login"} element={<SignIn />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
