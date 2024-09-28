import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideMenu from "./SideMenu";

function Layout() {
  return (
    <>
      <div className="md:h-16">
        <Header />
      </div>
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/5  ">
          <SideMenu />
        </div>
        <div className="lg:w-5/6 p-4 bg-white">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
