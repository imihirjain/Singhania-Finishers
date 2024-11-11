import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function SideMenu() {
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [error, setError] = useState(null);
  const localStorageData = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setError("Token is missing. Please log in again.");
    }

    if (localStorageData) {
      fetchProfileImage(localStorageData.firstName, localStorageData.lastName);
    }
  }, [localStorageData]);

  const fetchProfileImage = (firstName, lastName) => {
    const imageUrl = `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`;
    setProfileImageUrl(imageUrl);
  };

  const menuItems = [
    {
      to: "/dashboard-account",
      label: "Dashboard",
      icon: require("../assets/home.png"),
    },
    {
      to: "/account-stock-in",
      label: "Stock In",
      icon: require("../assets/stockIn.png"),
    },
    {
      to: "/account-in-table",
      label: "Stock In Table",
      icon: require("../assets/stockInTable.png"),
    },
    {
      to: "/account-out",
      label: "Stock Out",
      icon: require("../assets/stockInTable.png"),
    },
    {
      to: "/account-out-table",
      label: "Stock Out Table",
      icon: require("../assets/stockInTable.png"),
    },
    {
      to: "/grey-stock",
      label: "Grey Stock IN",
      icon: require("../assets/aso.jpeg"),
    },
    {
      to: "/grey-stock-out",
      label: "Grey Stock Out",
      icon: require("../assets/aso.jpeg"),
    },
    { to: "/heat", label: "Heatset", icon: require("../assets/aso.jpeg") },
    {
      to: "/heat-table",
      label: "Heatset Table",
      icon: require("../assets/aso.jpeg"),
    },
    { to: "/process", label: "Process", icon: require("../assets/aso.jpeg") },
    {
      to: "/process-table",
      label: "Process Table",
      icon: require("../assets/aso.jpeg"),
    },
    { to: "/finish", label: "Finish", icon: require("../assets/aso.jpeg") },
    {
      to: "/finish-table",
      label: "Finish Table",
      icon: require("../assets/aso.jpeg"),
    },
    { to: "/dispatch", label: "Dispatch", icon: require("../assets/aso.jpeg") },
    {
      to: "/dispatch-table",
      label: "Dispatch Table",
      icon: require("../assets/aso.jpeg"),
    },
    // {
    //   to: "/create-party",
    //   label: "Create Party",
    //   icon: require("../assets/home.png"),
    // },
    // {
    //   to: "/create-user",
    //   label: "Create User",
    //   icon: require("../assets/home.png"),
    // },
    // {
    //   to: "/admin-account-in-table",
    //   label: "Accounts In Data",
    //   icon: require("../assets/home.png"),
    // },
    // {
    //   to: "/admin-grey-stock-out",
    //   label: "Grey Stock Data",
    //   icon: require("../assets/home.png"),
    // },
    // {
    //   to: "/admin-heat-table",
    //   label: "Heatset Data",
    //   icon: require("../assets/heat.jpg"),
    // },
    // {
    //   to: "/admin-process-table",
    //   label: "Process Data",
    //   icon: require("../assets/home.png"),
    // },
    // {
    //   to: "/admin-finish-table",
    //   label: "Finish Data",
    //   icon: require("../assets/home.png"),
    // },
    // {
    //   to: "/admin-dispatch-table",
    //   label: "Dispatch Data",
    //   icon: require("../assets/home.png"),
    // },
    // {
    //   to: "/admin-account-out-table",
    //   label: "Accounts Out Data",
    //   icon: require("../assets/home.png"),
    // },
  ];

  return (
    <div className="h-full w-[265px] flex-col justify-between bg-nav hidden lg:flex shadow-md shadow-gray-600 font-login">
      <div className="pt-4">
        <nav aria-label="Main Nav" className="flex flex-col space-y-1">
          {menuItems.map((menuItem, index) => (
            <Link
              key={index}
              to={menuItem.to}
              className="flex items-center gap-2 rounded-lg hover:bg-login hover:text-white px-3 py-2"
            >
              <img
                alt={menuItem.label}
                src={menuItem.icon}
                className="flex items-center gap-2"
              />
              <span className="text-[16px] font-medium hover:bg-login hover:text-white font-login">
                {menuItem.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
      {/* Profile section */}
      <div className="fixed inset-x-0 bottom-0 w-[265px] h-[90px]">
        <Link to="/profile-page">
          <div className="flex items-center gap-2 bg-foooter_bg p-4 hover:bg-gray-50">
            <img
              alt="Profile"
              src={profileImageUrl || require("../assets/footer_img.png")}
              className="h-[48px] w-[48px] rounded-full object-cover"
            />
            <div className="font-semibold font-footer text-[14px]">
              <p className="text-xs">
                <strong className="block">
                  {localStorageData?.firstName} {localStorageData?.lastName}
                </strong>
                <span className="text-footer_red">View Profile</span>
              </p>
            </div>
          </div>
        </Link>
      </div>
      {error && <div className="text-red-500 text-center mt-2">{error}</div>}
    </div>
  );
}

export default SideMenu;
