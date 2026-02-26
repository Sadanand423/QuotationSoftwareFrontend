import React from "react";

const AllNotifications = ({ notifications }) => {
  const getTypeStyle = (type) => {
    switch (type) {
      case "APPROVAL":
        return "bg-green-100 text-green-700";
      case "REJECTION":
        return "bg-red-100 text-red-700";
      case "CREATION":
        return "bg-blue-100 text-blue-700";
      case "SENT":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-indigo-100 text-indigo-700";
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          All Notifications
        </h2>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No notifications available
          </div>
        ) : (
          notifications.map((n, i) => (
            <div key={n.id}>
              
              {/* Row */}
              <div className="flex items-center justify-between px-8 py-5 hover:bg-gray-50 transition">
                
                {/* Left */}
                <div className="flex flex-col">
                  <div className="text-base font-semibold text-gray-800">
                    {n.message}
                  </div>

                  <div className="text-sm text-gray-400 mt-1">
                    {n.timestamp
                      ? new Date(n.timestamp).toLocaleString()
                      : ""}
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-4 ml-10">
                  {/* Type */}
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${getTypeStyle(
                      n.type
                    )}`}
                  >
                    {n.type || "INFO"}
                  </span>

                  {/* Read */}
                  {!n.read ? (
                    <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                      New
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                      Read
                    </span>
                  )}
                </div>
              </div>

              {/* subtle separator */}
              {i !== notifications.length - 1 && (
                <div className="mx-8 h-px bg-gray-100"></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllNotifications;