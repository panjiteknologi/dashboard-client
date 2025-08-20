"use client";

import React, { useState } from "react";
import { trpc } from "@/trpc/react";

const IsoView = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, error } = trpc.iso.list.useQuery({ page, limit });

  if (isLoading) return <div>Loading ISO records...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const { isoRecords, pagination } = data || { isoRecords: [], pagination: null };

  return (
    <div>
      <h1 className="text-amber-700 font-bold text-2xl mb-4">ISO Records</h1>
      
      <div className="space-y-4">
        {/* Pagination Controls */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            ISO Records ({pagination?.total || 0} total)
          </h2>
          <div className="flex items-center gap-2">
            <label className="text-sm">Items per page:</label>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
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
              {pagination.total} ISO records
            </span>
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
          </div>
        )}

        {/* ISO Records List */}
        {isoRecords && isoRecords.length > 0 ? (
          isoRecords.map((iso) => (
            <div key={iso.id} className="border p-4 rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <p><span className="font-semibold">ID:</span> {iso.id}</p>
                <p><span className="font-semibold">Document No:</span> {iso.name || 'N/A'}</p>
                <p><span className="font-semibold">Company:</span> {iso.companyName || 'N/A'}</p>
                <p><span className="font-semibold">Certification:</span> {iso.certification || 'N/A'}</p>
                <p><span className="font-semibold">Contact:</span> {iso.contactPerson || 'N/A'}</p>
                <p><span className="font-semibold">Email:</span> {iso.email || 'N/A'}</p>
                <p><span className="font-semibold">State:</span> {iso.state || 'N/A'}</p>
                <p><span className="font-semibold">Issue Date:</span> {iso.issueDate?.toLocaleDateString() || 'N/A'}</p>
              </div>
              
              {/* Show certification flags */}
              <div className="mt-2 flex flex-wrap gap-2">
                {iso.show14001 && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">ISO 14001</span>}
                {iso.show45001 && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">ISO 45001</span>}
                {iso.show27001 && <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">ISO 27001</span>}
                {iso.show22000 && <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">ISO 22000</span>}
                {iso.showHaccp && <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">HACCP</span>}
                {iso.show13485 && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">ISO 13485</span>}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No ISO records found</p>
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

export default IsoView;