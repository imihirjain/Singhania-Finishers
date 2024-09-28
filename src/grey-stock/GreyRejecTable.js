import React, { useState, useEffect } from "react";
import axios from "axios";

function GreyTable() {
  const [submittedData, setSubmittedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); 
  const [isAdmin, setIsAdmin] = useState(false); // Assuming you receive the user's role from backend
  

  const checkAdminRole = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/login", {
        withCredentials: true,
      });
      // console.log("Login response data:", response.data); 

      const isAdmin = response.data.check === "Admin";
      console.log("Is Admin:", isAdmin);  // Log whether the user is recognized as Admin

      setIsAdmin(isAdmin);  // Update state based on whether the user is admin
    } catch (error) {
      console.error("Error checking admin role:", error);
    }
  };


  const fetchSubmittedData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/sales/data/all/reject",
        {
          withCredentials: true,
        }
      );
      const sortedData = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setSubmittedData(sortedData.reverse());
    } catch (error) {
      console.error("Error fetching submitted data:", error);
    }
  };

  useEffect(() => {
    checkAdminRole();
    fetchSubmittedData();
  }, []);


     // Handle Delete operation
     const handleDelete = async (id) => {
      try {
        const response = await axios.delete(`http://localhost:4000/api/delete/${id}`, {
          withCredentials: true,
        });
        console.log("Delete response:", response.data);  // Log the response from the delete API
        setSubmittedData(submittedData.filter(item => item.id !== id));  // Update the UI by removing the deleted item
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    };
    
  
    // Handle Update operation
    const handleUpdate = async (id, data) => {
      try {
        const response = await axios.put(`http://localhost:4000/api/update/${id}`, data, {
          withCredentials: true,
        });
        console.log("Update response:", response.data);  // Log the response from the update API
        fetchSubmittedData();  // Re-fetch data to update the UI
      } catch (error) {
        console.error("Error updating item:", error);
      }
    };
  

  const filteredData = submittedData.filter((dataItem) =>
    dataItem.selectedOption.toLowerCase().includes(searchQuery.toLowerCase())||
    dataItem.lotNumber.toLowerCase().includes(searchQuery.toLowerCase())||
    dataItem.challanNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full mt-6 bg-white border-nav border-2 rounded-lg">
      <div className="lg:flex ml-4 mt-4 justify-between items-center ">
          <div className="text-title font-bold">
            Grey Stock OUT Table <br /> Total:{filteredData.length}
          </div>

          <div className="flex mt-3 lg:mt-0 items-center bg-backgrnd justify-center mr-6 h-[35px] overflow-hidden rounded-full">
            <div>
              <img
                className="h-[24px] w-[24px] ml-5"
                src={require("../assets/stockinSearch.png")}
                alt="Inventory Management System"
              />
            </div>
            <div className="h-[25px] ml-6 border-total border-[1px]"></div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Party Name..."
              className="mb-4 mt-3 lg:w-[300px]  w-[350px] bg-backgrnd placeholder:text-center border border-none placeholder:font-login placeholder:text-[14px] placeholder:bg-backgrnd placeholder:text-total font-medium "
            />
          </div>
        </div>




         {filteredData.length === 0 ? (
          <div className="text-center">
            <p
              className="text-gray-800 font-semibold text-lg"
              style={{ color: "#4A90E2" }}
            >
              Sorry, no data available at the moment.
            </p>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y mt-6 divide-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-header text-header-font  font-header">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                  Party Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                  Challan Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                  Quality
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                  Shade
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                  Kg
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                  Meter
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                  Roll
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                  Process
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                  Lot Number
                </th>
                {isAdmin &&
    <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
   Actions
    </th>
   }

              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-login font-header text-[16px] font-medium divide-gray-200">
              {currentItems.map((dataItem, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-6 py-6 whitespace-nowrap">
                    {dataItem.selectedOption}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    {dataItem.challanNumber}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    {dataItem.quantity}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    {dataItem.shade}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    {dataItem.kg} KG </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    {dataItem.meter} M
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    {dataItem.roll}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    {dataItem.processTypes.join(", ")}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    {dataItem.lotNumber}
                  </td>
                  {isAdmin && (
                      <td>
                        <button onClick={() => handleUpdate(dataItem.id, dataItem)} className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                          Update
                        </button>
                        <button onClick={() => handleDelete(dataItem.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                          Delete
                        </button>
                      </td>
                    )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
        <ul className="flex justify-center my-4">
          {Array.from({
            length: Math.ceil(filteredData.length / itemsPerPage),
          }).map((_, index) => (
            <li
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-1 mx-1 cursor-pointer ${
                currentPage === index + 1
                  ? "bg-darkgray text-white hover:bg-white hover:text-darkgray hover:border-darkgray outline hover:outline-2 rounded-md hover:rounded-md "
                  : "bg-gray-300"
              }`}
            >
              {index + 1}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default GreyTable;
