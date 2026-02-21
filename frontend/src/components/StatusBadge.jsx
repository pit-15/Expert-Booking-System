import React from 'react';

export const StatusBadge = ({ status }) => {
 
  const styles = {
    Confirmed: "bg-green-100 text-green-700 border-green-200",
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Completed: "bg-indigo-100 text-indigo-700 border-indigo-200",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
};