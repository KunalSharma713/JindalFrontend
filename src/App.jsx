import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isExpired } from "react-jwt";
import {
  LoginAction,
  LogOutAction,
  PlantSelectionAction,
} from "../src/store/slices/LoginSlice";
import "./App.css";
import LocalStorageHelper from "./services/LocalStorageHelper";
import useFetchAPI from "./hooks/useFetchAPI";
import LoadingScreen from "./components/loaders/LoadingScreen";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppRoutes } from "./routes-navs/AppRoutes";
import MainLayout from "./layouts/MainLayout";
function App() {
  const { isLoggedIn } = useSelector((state) => state.LoginReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  console.log(import.meta.env.VITE_API_URL);

  // const [_, PlantsFetchHandler] = useFetchAPI(
  //   {
  //     url: `/plant`,
  //     method: "GET",
  //   },
  //   (res) => {
  //     const selectedPlant = LocalStorageHelper.getItem("selectedPlant");
  //     const allPlants = res?.Plant ?? [];

  //     dispatch(SetPlantsAction(allPlants));

  //     const validatedPlant = allPlants.find(
  //       (item) => item?._id === selectedPlant?._id
  //     );

  //     dispatch(PlantSelectionAction(validatedPlant ?? allPlants?.[0] ?? null));
  //     return res;
  //   },
  //   (err) => {
  //     return err?.response ?? true;
  //   }
  // );

  const starterFunction = async () => {
    const token = LocalStorageHelper.getItem("accessToken") ?? null;
    const refreshToken = LocalStorageHelper.getItem("refreshToken") ?? null;
    const isTokenExpired = token ? isExpired(token) : true;
    const isRefreshTokenExpired = refreshToken ? isExpired(refreshToken) : true;
    if (isRefreshTokenExpired) {
      dispatch(LogOutAction());
    } else if (isTokenExpired) {
      // refresh token call
    } else {
      // get userdetails
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
    return <LoadingScreen />;
  }
  return (
    <BrowserRouter>
      <Routes>
        {isLoggedIn ? (
          <Route path="/*" element={<LayoutMain />} />
        ) : (
          AppRoutes.map((item, index) => (
            <Route path={item.path} key={index} element={item.element} />
          ))
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
