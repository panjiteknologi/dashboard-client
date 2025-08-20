"use client";

import React, { useState } from "react";
import { trpc } from "@/trpc/react";

const DashboardView = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, error } = trpc.users.list.useQuery({ page, limit });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const { users, pagination } = data || { users: [], pagination: null };

  return (
    <div>
      <h1 className="text-amber-700 font-bold">Real Data : </h1>
      <br />
      
      <div className="space-y-4">
        {/* Pagination Controls */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Users ({pagination?.total || 0} total)
          </h2>
          <div className="flex items-center gap-2">
            <label className="text-sm">Items per page:</label>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1); // Reset to first page when changing limit
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Pagination Info */}
        {pagination && (
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} users
            </span>
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
          </div>
        )}

        {/* Users List */}
        {users && users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="border p-4 rounded">
              <p className="text-pink-800 font-black">ID: {user.id}</p>
              <p className="text-pink-800 font-black">Login: {user.login}</p>
              <p className="text-pink-800 font-black">Active: {user.active ? 'Yes' : 'No'}</p>
              <p className="text-pink-800 font-black">Company ID: {user.companyId}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No users found</p>
        )}

        {/* Pagination Buttons */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={!pagination.hasPrev}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {/* Page Numbers */}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(pageNum => 
                pageNum === 1 || 
                pageNum === pagination.totalPages || 
                Math.abs(pageNum - pagination.page) <= 2
              )
              .map((pageNum, index, array) => {
                // Add ellipsis if there's a gap
                const showEllipsis = index > 0 && pageNum - array[index - 1] > 1;
                return (
                  <React.Fragment key={pageNum}>
                    {showEllipsis && <span className="px-2">...</span>}
                    <button
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-1 border rounded ${
                        pageNum === pagination.page
                          ? 'bg-blue-500 text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  </React.Fragment>
                );
              })}
            
            <button
              onClick={() => setPage(page + 1)}
              disabled={!pagination.hasNext}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardView;
