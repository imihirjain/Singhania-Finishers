import React from "react";

const GreyPreviewTable = ({ data, isEditMode, onEdit }) => {
  const groupedData = data.reduce((acc, entry) => {
    const key = `${entry.lotNumber}-${entry.partyName}-${entry.quality}-${entry.shade}-${entry.processType}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(entry);
    return acc;
  }, {});

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString("en-US");
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return `${formattedDate}, ${formattedTime}`;
  };

  return (
    <div className="flex flex-col items-center mt-8">
    <div className="lg:overflow-x-auto overflow-x-scroll w-full md:w-[1000px] mt-8">
      <table className="min-w-full bg-white divide-y divide-login font-header text-[16px] font-medium divide-gray-200 border ">
        <thead className="bg-header text-header-font font-header">
          <tr>
            <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lot Number
            </th>
            <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Party Name
            </th>
            <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quality
            </th>
            <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Shade
            </th>
            <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Process
            </th>
            <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Challan Number
            </th>
            <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              KG
            </th>
            <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Meter
            </th>
            <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Roll
            </th>
            <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date Time
            </th>
            {isEditMode && (
              <th className="px-2 md:px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                Edit
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-login font-header text-[14px] font-medium divide-gray-200">
          {Object.keys(groupedData).map((key) =>
            groupedData[key].map((entry, index) => (
              <tr key={`${key}-${index}`}>
                {index === 0 && (
                  <>
                    <td
                      rowSpan={groupedData[key].length}
                      className="px-2 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                    >
                      {entry.lotNumber}
                    </td>
                    <td
                      rowSpan={groupedData[key].length}
                      className="px-2 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {entry.partyName}
                    </td>
                    <td
                      rowSpan={groupedData[key].length}
                      className="px-2 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {entry.quality}
                    </td>
                    <td
                      rowSpan={groupedData[key].length}
                      className="px-2 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {entry.shade}
                    </td>
                    <td
                      rowSpan={groupedData[key].length}
                      className="px-2 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {entry.processType}
                    </td>
                  </>
                )}
                <td className="px-2 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.challanNumber}
                </td>
                <td className="px-2 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.kg}
                </td>
                <td className="px-2 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.meter}
                </td>
                <td className="px-2 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.roll}
                </td>
                <td className="px-2 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(entry.dateTime)}
                </td>
                {isEditMode && (
                  <td className="px-2 md:px-6 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onEdit(entry)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      ✏️
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
  
  );
};

export default GreyPreviewTable;
