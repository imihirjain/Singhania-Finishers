import React, { useState, useEffect } from "react";
import axios from "axios"; 

const ProfilePage = () => {
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/api/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data.data); // Assuming the user data is in response.data.data
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser(); 
  }, []); 

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold font-login text-center text-nav shadow-lg bg-darkgray rounded-md p-6 hover:scale-105 transition-transform duration-300 w-full">
        Profile Page
      </h1>

      <div className="mt-8 max-w-md mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="border-2 h-[140px] w-[320px] lg:w-[500px] rounded-lg overflow-hidden shadow-md shadow-darkgray">
            <label
              htmlFor="name"
              className="block text-sm mt-4 ml-4 font-login font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-2 ml-4 focus:ring-darkgray focus:border-darkgray block w-full lg:w-[300px] shadow-sm sm:text-sm border-gray-300 rounded-md"
              value={`${user.firstName} ${user.lastName}`}
              readOnly
            />
            <div className="bg-darkgray h-4 w-full mt-2  "></div>
          </div>

          <div className="border-2 h-[140px] w-[320px] lg:w-[500px] rounded-lg overflow-hidden shadow-md shadow-darkgray">
            <label
              htmlFor="email"
              className="block text-sm mt-4 ml-4 font-login font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-2 ml-4 focus:ring-darkgray focus:border-darkgray block w-full lg:w-[300px] shadow-sm sm:text-sm border-gray-300 rounded-md"
              value={user.email}
              readOnly 
            />
            <div className="bg-darkgray h-4 w-full mt-2"></div>
          </div>

          <div className="border-2 h-[140px] w-[320px] lg:w-[500px] rounded-lg overflow-hidden shadow-md shadow-darkgray">
            <label
              htmlFor="phone"
              className="block text-sm ml-4 mt-4 font-login font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              className="mt-2  ml-4 focus:ring-darkgray focus:border-darkgray block w-full lg:w-[300px] shadow-sm sm:text-sm border-gray-300 rounded-md"
              value={user.phoneNumber || "N/A"}
              readOnly
            />
            <div className="bg-darkgray h-4 w-full mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
