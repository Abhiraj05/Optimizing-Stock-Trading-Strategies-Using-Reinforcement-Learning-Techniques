import React from "react";
import { useNavigate } from "react-router-dom";
import MySvg from "../assets/vecteezy_green-dollars-and-a-stack-of-gold-coins-a-bag-of-money-in_23743918.png";
import FadeIn from 'react-fade-in';

export function LandingPage() {
    const navigate = useNavigate();
  return (
    <FadeIn>
    <div className="min-h-screen relative mt-0">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20">
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
    </FadeIn>
  );
}
