import React, { useState } from "react";
import { toast } from "react-toastify";

const Table = ({ data, isEditMode, onEdit }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);

  const filteredData = data.filter(
    (item) =>
      item.partyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.challanNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.quality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedData = React.useMemo(() => {
    return filteredData.reduce((groups, item) => {
      const { challanNumber } = item;
      if (!groups[challanNumber]) {
        groups[challanNumber] = [];
      }
      groups[challanNumber].push(item);
      return groups;
    }, {});
  }, [filteredData]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <div className="overflow-x-auto mt-4">
        <table className="border min-w-full divide-y mt-2 divide-gray-200 overflow-hidden">
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
                Kg
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                Meter
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                Roll
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                Date & Time
              </th>
              {isEditMode && (
                <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                  Edit
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-login font-header text-[16px] font-medium divide-gray-200">
            {Object.entries(groupedData).map(([challanNumber, entries], index) => (
              entries.map((item, rowIndex) => (
                <tr key={`${challanNumber}-${rowIndex}`}>
                  {/* Display challan number only in the first row of each group */}
                  {rowIndex === 0 && (
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      rowSpan={entries.length}
                    >
                      {item.partyName}
                    </td>
                  )}

                    {rowIndex === 0  &&(
                        <td className="px-12 py-4 whitespace-nowrap"
                        rowSpan={entries.length}
                        >
                          {item.challanNumber}
                        </td>
                    )}
                  
                  <td className="px-6 py-4 whitespace-nowrap">{item.quality}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.kg}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.meter}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.roll}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.date}

                   <span className="ml-2">{item.time}</span></td>
                  {isEditMode && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        ✏️
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
