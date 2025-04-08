import React from "react";
import { useNavigate } from "react-router-dom";
import MySvg from "../assets/vecteezy_green-dollars-and-a-stack-of-gold-coins-a-bag-of-money-in_23743918.png";

export function LandingPage() {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen relative mt-0">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20">
          <div
            // className="w-full h-full"
            // style={{
            //   // backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.12'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            //   backgroundSize: "30px 30px",
            // }}
          />
        </div>
      </div>
      <div className="relative z-10">
        <div className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="lg:flex lg:justify-center lg:items-center">
            <div className="">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-7xl mb-6">
                <p className="first:text-green-400">Trade Smarter with</p>
                <p>Advanced Analytics</p>
              </h1>
              <p className="text-lg text-gray-200 mb-9 max-w-2xl mx-auto">
                Access real-time market data, advanced analytics, and
                professional trading tools. Join thousands of successful traders
                on our cutting-edge platform.
              </p>
              <div className="flex justify-start items-center">
              <button className="px-6 py-3 rounded-lg  font-semibold text-lg hover:text-green-400 hover:bg-gray-700 hov border-2 hover:border-green-400 bg-green-400 text-gray-700 " onClick={() => navigate("/chart")}>
                Get Started
              </button>
              </div>
            </div>
            <div className="w-full md:w-[550px] lg:w-[650px] flex justify-center">
              <img
                src={MySvg}
                alt="Analytics"
                className="w-full h-auto max-w-md lg:max-w-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
