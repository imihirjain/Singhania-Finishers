import React from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";

import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import NoPageFound from "./pages/NoPageFound";
import ProfilePage from "./pages/ProfilePage";
import Dashboard from "./pages/Dashboard";

import AuthContext from "./AuthContext";
import ProtectedWrapper from "./ProtectedWrapper";
import { useEffect, useState } from "react";

import AccountStockIn from "./account-in/AccountStockIn";
import AccountInTable from "./account-in/AccountInTable";
import AccountOut from "./account-in/AccountStockOut";
import AccountOutTable from "./account-in/AccountStockOutTable";

import GreyStockIn from "./grey-stock/GreyStockIn";
import GreyStockOutTable from "./grey-stock/GreyStockOutTable";

import Heat from "./heat/Heat";
import HeatIssueTable from "./heat/HeatsetTable";

import Process from "./process/Process";
import ProcessingIssueTable from "./process/ProcessTable";

import DispatchStockIn from "./dispatch/Dispatch";
import DispatchStockTable from "./dispatch/DispatchTable";


import Finish from "./finish/Finish";
import FinishTable from "./finish/FinishTable";

import CreateParty from "./admin/CreateParty";
import RegisterUser from "./admin/RegisterForm";
// Admin Tables
import AccountInTabl from "./admin/Tables/AccountInTable";
import GreyStockOutTabl from "./admin/Tables/GreyStockOutTable";
import HeatIssueTabl from "./admin/Tables/HeatsetTable";
import ProcessingIssueTabl from "./admin/Tables/ProcessTable";
import FinishTabl from "./admin/Tables/FinishTable";
import DispatchStockTabl from "./admin/Tables/DispatchTable";
import AccountOutTabl from "./admin/Tables/AccountStockOutTable";

const App = () => {
  const [user, setUser] = useState("");
  const [loader, setLoader] = useState(true);
  let myLoginUser = JSON.parse(localStorage.getItem("user"));
  // console.log("USER: ",user)

  useEffect(() => {
    if (myLoginUser) {
      setUser(myLoginUser._id);
      setLoader(false);
      // console.log("inside effect", myLoginUser)
    } else {
      setUser("");
      setLoader(false);
    }
  }, [myLoginUser]);

  const signin = (newUser, callback) => {
    setUser(newUser);
    callback();
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  let value = { user, signin, signout };

  if (loader)
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>LOADING...</h1>
      </div>
    );

  return (
    <AuthContext.Provider value={value}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedWrapper>
                <Layout />
              </ProtectedWrapper>
            }
          >
            {/* ----------------------- Common Routes -------------------------- */}

            <Route path="dashboard-account" index element={<Dashboard />} />
            <Route path="profile-page" element={<ProfilePage />} />

            {/* ----------------------- Account In Routes -------------------------- */}

            <Route path="account-stock-in" element={<AccountStockIn />} />
            <Route path="account-in-table" element={<AccountInTable />} />

            {/* ----------------------- Account Out Routes -------------------------- */}

            <Route path="account-out" element={<AccountOut />} />
            <Route path="account-out-table" element={<AccountOutTable />} />

            {/* ----------------------- Grey Routes -------------------------- */}

            <Route path="grey-stock" element={<GreyStockIn />} />
            <Route path="grey-stock-out" element={<GreyStockOutTable />} />

            {/* ----------------------- Heat Routes -------------------------- */}

            <Route path="heat" element={<Heat />} />
            <Route path="heat-table" element={<HeatIssueTable />} />

            {/* ----------------------- Process Routes -------------------------- */}

            <Route path="process" element={<Process />} />
            <Route path="process-table" element={<ProcessingIssueTable />} />

            {/* ----------------------- Finish Routes -------------------------- */}

            <Route path="finish" element={<Finish />} />
            <Route path="finish-table" element={<FinishTable />} />

            {/* ----------------------- Dispatch Routes -------------------------- */}

            <Route path="dispatch" element={<DispatchStockIn />} />
            <Route path="dispatch-table" element={<DispatchStockTable />} />

            {/* ----------------------- Admin Routes -------------------------- */}
            <Route path="create-party" element={<CreateParty />} />
            <Route path="create-user" element={<RegisterUser />} />

            {/* -------------------Admin Tables Data---------------------- */}

            <Route path="admin-account-in-table" element={<AccountInTabl />} />
            <Route path="admin-account-out-table" element={<AccountOutTabl />} />
            <Route path="admin-grey-stock-out" element={<GreyStockOutTabl />} />
            <Route path="admin-heat-table" element={<HeatIssueTabl />} />
            <Route path="admin-process-table" element={<ProcessingIssueTabl />} />
            <Route path="admin-finish-table" element={<FinishTabl />} />
            <Route path="admin-dispatch-table" element={<DispatchStockTabl />} />
          </Route>
          <Route path="*" element={<NoPageFound />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
