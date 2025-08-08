import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { approutes } from "./routes-navs/approutes";
import LayoutMain from "./layouts/layout/LayoutMain";
import { ToastContainer } from "react-toastify";
import { Tooltip } from "react-tooltip";
import "react-toastify/dist/ReactToastify.css";
import {
  LoginAction,
  LogOutAction,
  PlantSelectionAction,
  SetPlantsAction,
} from "../src/store/slices/LoginSlice";
import { isExpired } from "react-jwt";
import LocalStorageHelper from "./services/LocalStorageHelper";
import useFetchAPI from "./hooks/useFetchAPI";

function App() {
  const { IsLoggedIn } = useSelector((state) => state.LoginReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const [_, PlantsFetchHandler] = useFetchAPI(
    {
      url: `/plant`,
      method: "GET",
    },
    (res) => {
      const selectedPlant = LocalStorageHelper.getItem("selectedPlant");
      const allPlants = res?.Plant ?? [];

      dispatch(SetPlantsAction(allPlants));

      const validatedPlant = allPlants.find(
        (item) => item?._id === selectedPlant?._id
      );

      dispatch(
        PlantSelectionAction(validatedPlant ?? allPlants?.[0] ?? null)
      );
      return res;
    },
    (err) => {
      return err?.response ?? true;
    }
  );

  const starterFunction = async () => {
    const token = LocalStorageHelper.getItem("accessToken") ?? null;
    const user = LocalStorageHelper.getItem("user") ?? null;
    const refreshToken = LocalStorageHelper.getItem("refreshToken") ?? null;
    const isTokenExpired = isExpired(token);

    if (!token || !user || !refreshToken || isTokenExpired) {
      dispatch(LogOutAction());
    } else {
      dispatch(LoginAction({ accessToken: token, refreshToken, user }));
      await PlantsFetchHandler();
    }
  };

  useEffect(() => {
    const loadApp = async () => {
      const MIN_LOADING_TIME = 1000; // 2 seconds
      const start = Date.now();

      await starterFunction();

      const elapsed = Date.now() - start;
      const remainingTime = MIN_LOADING_TIME - elapsed;

      if (remainingTime > 0) {
        setTimeout(() => setLoading(false), remainingTime);
      } else {
        setLoading(false);
      }
    };

    loadApp();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ fontSize: "1.2rem", color: "#555" }}>
          Loading application...
        </p>
      </div>
    );
  }

  return (
    <Suspense fallback={"Loading..."}>
      <BrowserRouter>
        <Routes>
          {IsLoggedIn ? (
            <Route path="/*" element={<LayoutMain />} />
          ) : (
            approutes.map((item, index) => (
              <Route path={item.path} key={index} element={item.element} />
            ))
          )}
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        limit={5}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <Tooltip
        className="tool-tip-classname-default"
        id="my-tooltip"
        style={{ zIndex: "9999" }}
      />
    </Suspense>
  );
}

export default App;
