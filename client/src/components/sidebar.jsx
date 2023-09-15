import React from "react";

function sidebar() {
  return (
    <div className="bg-gray-800 text-white h-screen w-64 fixed top-0 left-0 overflow-y-auto">
      <div className="p-4">
        <h1 className="text-2xl font-bold">My Sidebar</h1>
        <ul className="mt-4">
          <li className="py-2">
            <a href="#" className="text-gray-400 hover:text-white">
              Home
            </a>
          </li>
          <li className="py-2">
            <a href="#" className="text-gray-400 hover:text-white">
              About
            </a>
          </li>
          <li className="py-2">
            <a href="#" className="text-gray-400 hover:text-white">
              Services
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default sidebar;
