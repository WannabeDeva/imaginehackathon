import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import { Button } from "@/components/ui/button";
import { Leaf, History, Users, BarChart2, Menu, X } from "lucide-react";
import logo from "../assets/logo.png"
import LanguageSwitch from "./LanguageSwitch";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation(); // Get the current location

  const navItems = [
    { to: "/crop-diagnostics", label: "Crop Diagnostics", icon: Leaf },
    { to: "/history", label: "Previous Diagnostics", icon: History },
    
  ];

  return (
    <nav className="bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg">
      <div className="max-w-screen-xl mx-auto">
        {/* Desktop Navigation */}
        <div className="py-4 px-6 flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 transition-transform hover:scale-105"
          >
            <img src={logo} alt="logo" width={250} />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              // Check if the current route matches the nav item path
              const isActive = location.pathname === item.to;
              return (
                <Link key={item.to} to={item.to}>
                  <Button 
                    variant="ghost" 
                    className={`text-green-50 hover:bg-green-600 hover:text-white transition-all
                      flex items-center gap-2 px-4 py-2 rounded-lg
                      ${isActive ? "bg-green-800 text-white border-b-4 border-green-300" : ""}`} // Active style with background and underline
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          <LanguageSwitch />

          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden text-white hover:bg-green-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen 
              ? "max-h-screen opacity-100 visible"
              : "max-h-0 opacity-0 invisible"
          }`}
        >
          <div className="px-4 pb-4 space-y-2 bg-green-700">
            {navItems.map((item) => {
              const Icon = item.icon;
              // Check if the current route matches the nav item path
              const isActive = location.pathname === item.to;
              return (
                <Link 
                  key={item.to} 
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className={`w-full text-green-50 hover:bg-green-600 hover:text-white
                      flex items-center gap-2 justify-start px-4 py-2 rounded-lg
                      ${isActive ? "bg-green-800 text-white border-b-4 border-green-300" : ""}`} // Active style for mobile
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
          <LanguageSwitch />
        </div>
        
      </div>
      
    </nav>
  );
};

export default Navbar;
