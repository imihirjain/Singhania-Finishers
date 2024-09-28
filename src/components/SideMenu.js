import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function SideMenu() {
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const localStorageData = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      fetchUserRole(storedToken);
    } else {
      setError("Token is missing. Please log in again.");
    }

    if (localStorageData) {
      fetchProfileImage(localStorageData.firstName, localStorageData.lastName);
    }
  }, [localStorageData]);

  const fetchUserRole = async (token) => {
    try {
      const response = await axios.get("http://localhost:4000/api/auth/user", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.data && response.data.data.check) {
        setUserRole(response.data.data.check);
        console.log("User role set to:", response.data.data.check);
      } else if (response.data && response.data.check) {
        setUserRole(response.data.check);
        console.log("User role set to:", response.data.check);
      } else {
        setError("Invalid response structure");
        console.error("Invalid response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching user role:", error.response || error.message || error);
      setError("Failed to fetch user role");
    }
  };

  const fetchProfileImage = (firstName, lastName) => {
    const imageUrl = `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`;
    setProfileImageUrl(imageUrl);
  };

  const menuItems = {
    Account: [
      { to: "/dashboard-account", label: "Dashboard", icon: require("../assets/home.png") },
      { to: "/account-stock-in", label: "Stock In", icon: require("../assets/stockIn.png") },
      { to: "/account-in-table", label: "Stock In Table", icon: require("../assets/stockInTable.png") },
      { to: "/account-out", label: "Stock Out ", icon: require("../assets/stockInTable.png") },
      { to: "/account-out-table", label: "Stock Out Table", icon: require("../assets/stockInTable.png") },
    ],
    Grey: [
      { to: "/dashboard-account", label: "Dashboard", icon: require("../assets/home.png") },
      { to: "/grey-stock", label: "Grey Stock IN", icon: require("../assets/aso.jpeg") },
      { to: "/grey-stock-out", label: "Grey Stock Out", icon: require("../assets/aso.jpeg") },
    ],
    Heat: [
      { to: "/dashboard-account", label: "Dashboard", icon: require("../assets/home.png") },
      { to: "/heat", label: "Heatset", icon: require("../assets/aso.jpeg") },
      { to: "/heat-table", label: "Heatset Table", icon: require("../assets/aso.jpeg") },
    ],
    Process: [
      { to: "/dashboard-account", label: "Dashboard", icon: require("../assets/home.png") },
      { to: "/process", label: "Process ", icon: require("../assets/aso.jpeg") },
      { to: "/process-table", label: "Process Table ", icon: require("../assets/aso.jpeg") },
    ],
    Finish: [
      { to: "/dashboard-account", label: "Dashboard", icon: require("../assets/home.png") },
      { to: "/finish", label: "Finish ", icon: require("../assets/aso.jpeg") },
      { to: "/finish-table", label: "Finish Table ", icon: require("../assets/aso.jpeg") },
    ],
    Dispatch: [
      { to: "/dashboard-account", label: "Dashboard", icon: require("../assets/home.png") },
      { to: "/dispatch", label: "Dispatch ", icon: require("../assets/aso.jpeg") },
      { to: "/dispatch-table", label: "Dispatch Table", icon: require("../assets/aso.jpeg") },
    ],
    Admin: [
      { to: "/dashboard-account", label: "Dashboard", icon: require("../assets/home.png") },
      { to: "/create-party", label: "Create Party", icon: require("../assets/home.png") },
      { to: "/create-user", label: "Create User", icon: require("../assets/home.png") },
      { to: "/admin-account-in-table", label: "Accounts In Data", icon: require("../assets/home.png") },
      { to: "/admin-grey-stock-out", label: "Grey Stock Data", icon: require("../assets/home.png") },
      { to: "/admin-heat-table", label: "Heatset Data", icon: require("../assets/heat.jpg") },
      { to: "/admin-process-table", label: "Process Data", icon: require("../assets/home.png") },
      { to: "/admin-finish-table", label: "Finish Data", icon: require("../assets/home.png") },
      { to: "/admin-dispatch-table", label: "Dispatch Data", icon: require("../assets/home.png") },
      { to: "/admin-account-out-table", label: "Accounts Out Data", icon: require("../assets/home.png") },
    ],
  };

  const filteredMenuItems = menuItems[userRole] || [];

  return (
    <div className="h-full w-[265px] flex-col justify-between bg-nav hidden lg:flex shadow-md shadow-gray-600 font-login">
      <div className="pt-4">
        <nav aria-label="Main Nav" className="flex flex-col space-y-1">
          {filteredMenuItems.map((menuItem, index) => (
            <Link
              key={index}
              to={menuItem.to}
              className="flex items-center gap-2 rounded-lg hover:bg-login hover:text-white px-3 py-2"
            >
              <img alt={menuItem.label} src={menuItem.icon} className="flex items-center gap-2" />
              <span className="text-[16px] font-medium hover:bg-login hover:text-white font-login">{menuItem.label}</span>
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
                <span className="text-footer_red">
                  View Profile
                </span>
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
