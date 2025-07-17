import React from 'react';

const SkeletonLoader = ({ rows = 5, cols = 6 }) => {
  return (
    <div className="animate-pulse">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              {Array.from({ length: cols }).map((_, index) => (
                <th key={index} className="px-5 py-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-t">
                {Array.from({ length: cols }).map((_, colIndex) => (
                  <td key={colIndex} className="px-5 py-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkeletonLoader;
