
import { Routes, Route, Outlet } from "react-router-dom";
import React, { useEffect } from "react";
import "../../assets/css/layouts.css";
import { SidebarProvider } from "../../components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Header } from "./header";
import { LayoutRoutes } from "../../routes-navs/LayoutRoutes"; // Imported LayoutRoutes
import { ChangeScreenViewAction } from "../../store/slices/SideBarSlice";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "react-responsive";
const LayoutMain = () => {

  const dispatch = useDispatch();
  const isDesktopScreenSize = useMediaQuery({ minWidth: 770 });
  useEffect(() => {
    if (isDesktopScreenSize) {
      dispatch(ChangeScreenViewAction({ IsMobile: false }));
    } else {
      dispatch(ChangeScreenViewAction({ IsMobile: true }));
    }
  }, [isDesktopScreenSize]);



  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <div
        className="main-div"
      >

        <Header />
        <Routes>
          {LayoutRoutes.map((item, index) => (
            <Route key={index} path={item.path} element={item.element} />
          ))}
        </Routes>

        <Outlet />
      </div>
    </SidebarProvider>
  );
};

export default LayoutMain;
