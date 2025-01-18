import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-semibold mb-6">Welcome, [Farmer's Name]!</h2>

        {/* Farm Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Crop Status Card */}
          <Card>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">Crop Status</h3>
              <p className="text-gray-700">Quick health overview of your crops.</p>
              <Button className="mt-4 w-full" as={Link} to="/crop-diagnostics">
                View Crop Diagnostics
              </Button>
            </div>
          </Card>

          {/* Cattle Status Card */}
          <Card>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">Cattle Status</h3>
              <p className="text-gray-700">Quick health overview of your cattle.</p>
              <Button className="mt-4 w-full" as={Link} to="/cattle-health">
                View Cattle Health
              </Button>
            </div>
          </Card>

          {/* Reminders & Alerts Card */}
          <Card>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">Reminders & Alerts</h3>
              <p className="text-gray-700">Stay updated with your farm's tasks and alerts.</p>
              <Button className="mt-4 w-full" as={Link} to="/reminders">
                View Alerts
              </Button>
            </div>
          </Card>
        </div>

        {/* Activity Summary */}
        <section className="mt-8">
          <h3 className="text-2xl font-semibold mb-4">Recent Activities</h3>
          <ul className="space-y-4">
            <li className="bg-white p-4 rounded-lg shadow-md">
              <p className="font-medium">Latest Crop Diagnosis: Healthy soil detected.</p>
            </li>
            <li className="bg-white p-4 rounded-lg shadow-md">
              <p className="font-medium">New Cattle Health Update: Vaccination due in 2 days.</p>
            </li>
            <li className="bg-white p-4 rounded-lg shadow-md">
              <p className="font-medium">Scheduled Expert Consultation: Crop expert visit next week.</p>
            </li>
          </ul>
        </section>

        {/* Footer */}
        <Chatbot />
      </main>
    </div>
  );
};

export default Dashboard;
