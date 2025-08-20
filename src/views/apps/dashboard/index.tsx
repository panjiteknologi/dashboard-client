"use client";

import React from "react";
import { trpc } from "@/trpc/react";

const DashboardView = () => {
  const { data, isLoading, error } = trpc.users.list.useQuery();

  console.log("Fetched Users:", data);

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1 className="text-amber-700 font-bold">Real Data : </h1>
      <br />
      <div className="space-y-4">
        {/* <h2 className="text-lg font-semibold">Users ({data?.length})</h2> */}
        {/* {data?.map((user) => (
          <div key={user.id} className="border p-4 rounded">
            <p className="text-pink-800 font-black">ID: {user.id}</p>
            <p className="text-pink-800 font-black">Login: {user.login}</p>
            <p className="text-pink-800 font-black">Active: {user.active ? 'Yes' : 'No'}</p>
            <p className="text-pink-800 font-black">Company ID: {user.companyId}</p>
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default DashboardView;
