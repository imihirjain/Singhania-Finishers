import React, { useState, useEffect } from "react";

const ReusableTable = ({ lots, handleMarkComplete, text }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (!searchQuery) {
      return lots;
    }
    return lots.filter(
      (item) =>
        (item.partyName &&
          item.partyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.qualityChallanNumber &&
          item.qualityChallanNumber
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (item.lotNumber &&
          item.lotNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const filteredData = handleSearch();

  useEffect(() => {
    console.log("Filtered Data:", filteredData);
  }, [filteredData]);

  // Function to format the date and time
  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateTimeString).toLocaleString("en-US", options);
  };

  // Sort the data by date in descending order
  const sortedData = filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="flex flex-col  items-center ">
      <div className="w-full mt-6 bg-white border-nav border-2 rounded-lg">
        <div className="flex flex-col lg:flex lg:flex-row ml-4 mt-4 lg:justify-between ">
          <div className="text-title font-bold">
            {text} <br /> Total: {filteredData.length}
          </div>

          <div className="flex items-center mt-3 bg-backgrnd justify-center mr-6 h-[35px] overflow-hidden rounded-full">
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
              placeholder="Search "
              className="mb-4 mt-3 w-[250px] bg-backgrnd placeholder:text-center border border-none placeholder:font-login placeholder:text-[14px] placeholder:bg-backgrnd placeholder:text-total font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y mt-6 divide-gray-200 border overflow-hidden">
            <thead className="bg-header text-header-font font-header ">
              <tr>
              <th className="px-8 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                  Lot Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                  Party Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                  Quality
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                  Shade
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                  Process
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                  Challan Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                  KG
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                  Meter
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                  Roll
                </th>
                
                <th className="px-12 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-login font-header text-[16px] font-medium divide-gray-200">
              {filteredData.length > 0 ? (
                sortedData.map((lot) => (
                  <React.Fragment key={lot._id}>
                    {lot.entries.map((entry, idx) => (
                      <tr key={entry._id}>
                        {idx === 0 && (
                          <React.Fragment>
                             <td
                            className="px-5 py-2 whitespace-nowrap"
                            rowSpan={lot.entries.length}
                          >
                            {formatDateTime(lot.createdAt)}
                          </td>
                            <td
                              className="px-5 py-2 whitespace-nowrap"
                              rowSpan={lot.entries.length}
                            >
                              {lot.lotNumber}
                            </td>
                            <td
                              className="px-5 py-2 whitespace-nowrap"
                              rowSpan={lot.entries.length}
                            >
                              {lot.partyName}
                            </td>
                            <td
                              className="px-5 py-2 whitespace-nowrap"
                              rowSpan={lot.entries.length}
                            >
                              {lot.quality}
                            </td>
                            <td
                              className="px-5 py-2 whitespace-nowrap"
                              rowSpan={lot.entries.length}
                            >
                              {lot.shade}
                            </td>
                            <td
                              className="px-5 py-2 whitespace-nowrap"
                              rowSpan={lot.entries.length}
                            >
                              {lot.processType}
                            </td>
                          </React.Fragment>
                        )}
                        <td className="px-5 py-2 whitespace-nowrap">
                          {entry.challanNumber}
                        </td>
                        <td className="px-5 py-2 whitespace-nowrap">
                          {entry.kg}
                        </td>
                        <td className="px-5 py-2 whitespace-nowrap">
                          {entry.meter}
                        </td>
                        <td className="px-5 py-2 whitespace-nowrap">
                          {entry.roll}
                        </td>
          
                        {idx === 0 && (
                          <td
                            className="px-6 py-4 whitespace-nowrap"
                            rowSpan={lot.entries.length}
                          >
                            <button
                              className="inline-flex mt-1 px-8 py-2 text-sm font-medium text-white bg-darkgray rounded-md hover:bg-white hover:text-darkgray outline"
                              onClick={() => handleMarkComplete(lot._id)}
                            >
                              Submit
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="12"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReusableTable;
