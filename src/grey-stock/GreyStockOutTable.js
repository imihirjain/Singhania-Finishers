import React, { useState, useEffect } from "react";
import axios from "axios";

function GreyStockOutTable() {
  const [submittedData, setSubmittedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSubmittedData();
  }, []);

  const fetchSubmittedData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/lots", {
        withCredentials: true,
      });
      console.log("Fetched Data:", response.data);
      const sortedData = response.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setSubmittedData(sortedData);
    } catch (error) {
      console.error("Error fetching submitted data:", error);
    }
  };

  const handleSearch = () => {
    const filteredData = submittedData.filter(
      (item) =>
        item.partyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.lotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.entries.some((entry) =>
          entry.challanNumber.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
    return filteredData;
  };

  // Format date function
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

  const groupByAttributes = (data) => {
    const grouped = data.reduce((acc, lot) => {
      const key = `${lot.lotNumber}-${lot.partyName}-${lot.quality}-${lot.shade}-${lot.processType}-${lot.status}`;
      if (!acc[key]) {
        acc[key] = { ...lot, entries: [] };
      }
      acc[key].entries = [...acc[key].entries, ...lot.entries];
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const filteredData = groupByAttributes(handleSearch());

  return (
    <div className="flex flex-col items-center">
      <div className="w-full mt-6 bg-white border-nav border-2 rounded-lg">
        <div className="flex flex-col lg:flex lg:flex-row ml-4 mt-4 lg:justify-between">
          <div className="text-title font-bold">
            Grey Stock Out Table <br /> Total: {filteredData.reduce((total, lot) => total + lot.entries.length, 0)}
          </div>

          <div className="flex mt-3 items-center bg-backgrnd justify-center mr-6 h-[35px] overflow-hidden rounded-full">
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
              placeholder="Search Party Name..."
              className="mb-4 mt-3 w-[250px] bg-backgrnd placeholder:text-center border border-none placeholder:font-login placeholder:text-[14px] placeholder:bg-backgrnd placeholder:text-total font-medium"
            />
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-800 font-semibold text-lg" style={{ color: "#4A90E2" }}>
              Sorry, no data available at the moment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y mt-6 divide-gray-200 border overflow-hidden">
              <thead className="bg-header text-header-font font-header">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Lot Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Party Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Quality
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Shade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Process
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Challan Number
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-login font-header text-[16px] font-medium divide-gray-200">
                {filteredData.map((lot) => (
                  <React.Fragment key={lot._id}>
                    {lot.entries.map((entry, index) => (
                      <tr key={entry._id}>
                        {index === 0 && (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" rowSpan={lot.entries.length}>
                              {formatDateTime(lot.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" rowSpan={lot.entries.length}>
                              {lot.lotNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" rowSpan={lot.entries.length}>
                              {lot.partyName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" rowSpan={lot.entries.length}>
                              {lot.quality}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" rowSpan={lot.entries.length}>
                              {lot.shade}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" rowSpan={lot.entries.length}>
                              {lot.processType}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" rowSpan={lot.entries.length}>
                              {lot.status}
                            </td>
                          </>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.challanNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.kg}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.meter}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.roll}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default GreyStockOutTable;
