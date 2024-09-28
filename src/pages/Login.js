import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const notify = () => toast("Login Successful!");
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const authCheck = (response) => {
    console.log("authCheck response:", response);
    notify();
    console.log("Full response object:", response);
    const { data, token } = response;
    console.log("Data object:", data);
    console.log("Token extracted from response:", token);
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("token", token);
    console.log("Token stored in localStorage:", token);
    authContext.signin(data._id, () => {
      console.log("User role:", data.check);
      switch (data.check) {
        case "Admin":
          navigate("/dashboard-account");
          break;
        case "Account":
          navigate("/dashboard-account");
          break;
        case "Heat":
          navigate("/dashboard-account");
          break;
        case "Finish":
          navigate("/dashboard-account");
          break;
        case "Process":
          navigate("/dashboard-account");
          break;
        case "Grey":
          navigate("/dashboard-account");
          break;
        case "Dispatch":
          navigate("/dashboard-account");
          break;
        default:
          navigate("/");
          break;
      }
    });
  };

  const loginUser = (e) => {
    e.preventDefault();
    if (form.email === "" || form.password === "") {
      toast.error("Please enter both email and password to login.");
      return;
    }
    fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(form),
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Login failed.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Login successful:", data);
        console.log("Full response object:", data);
        if (data) {
          authCheck(data);
        } else {
          toast.error("Invalid response from server.");
        }
      })
      .catch((error) => {
        console.error("Login error:", error.message);
        toast.error("Wrong credentials, try again.");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(e);
  };

  return (
    <>
      <ToastContainer position="top-center" />
      <div className="grid grid-cols-1 sm:grid-cols-2 h-screen items-center place-items-center">
        <div className="flex justify-center">
          <img src={require("../assets/Logo1.png")} alt="Logo" />
        </div>
        <div className="w-full max-w-md space-y-8 p-10 rounded-lg">
          <div>
            <h2 className="mt-6 mb-[54px] text-center text-[33px] font-bold tracking-tight text-login font-heading">
              Login to your Account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="-space-y-px rounded-md shadow-sm">
              <div className="text-gray3 text-[14px] font-login font-semibold">
                Email
                <label htmlFor="email-address" className="sr-only"></label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full mt-[24px] mb-[24px] rounded-[3px] border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-lightMerchanta placeholder:text-[16px] placeholder:text-placeholder focus:z-10 focus:ring-2 focus:ring-inset focus:ring-lightMerchanta sm:text-sm sm:leading-6"
                  placeholder="Enter Your Email"
                  value={form.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="text-gray3 text-[14px] font-login font-semibold">
                Password
                <label htmlFor="password" className="sr-only"></label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full rounded-[3px] border-0 py-1.5 px-1.5 ring-1 ring-inset ring-lightMerchanta placeholder:text-[16px] placeholder:text-placeholder focus:z-10 focus:ring-2 focus:ring-inset focus:ring-lightMerchanta sm:text-sm sm:leading-6"
                  placeholder="Enter Your Password"
                  value={form.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center justify-between"></div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-gray py-2 px-3 text-sm text-white hover:bg-white hover:text-darkgray outline hover:outline-2 hover:border-darkgray focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-darkgray font-forget font-extrabold"
                onClick={loginUser}
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3"></span>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
