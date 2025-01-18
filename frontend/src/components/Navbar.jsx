import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="bg-green-600 text-white py-4 px-6">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Logo or App Name */}
        <h1 className="text-2xl font-bold">
          <Link to="/">AgriCare Hub</Link>
        </h1>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:underline">
            <Button variant="ghost" className="text-white">Dashboard</Button>
          </Link>
          <Link to="/crop-diagnostics" className="hover:underline">
            <Button variant="ghost" className="text-white">Crop Diagnostics</Button>
          </Link>
          <Link to="/cattle-health" className="hover:underline">
            <Button variant="ghost" className="text-white">Cattle Health</Button>
          </Link>
          <Link to="/community-forum" className="hover:underline">
            <Button variant="ghost" className="text-white">Community Forum</Button>
          </Link>
          <Link to="/analytics" className="hover:underline">
            <Button variant="ghost" className="text-white">Analytics</Button>
          </Link>
          
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Button variant="ghost" className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
