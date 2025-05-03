'use client'

import Link from 'next/link'
import Image from 'next/image'

export const Hero = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-primary-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Hero Text */}
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Streamline Reports, Maximize Growth
            </h1>
            <p className="text-lg text-gray-600 max-w-lg">
              Transform your PowerBuilder reports into interactive, accessible insights. View, share, and analyze your data from anywhere, on any device.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/register"
                className="bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors text-center"
              >
                Start Free Trial
              </Link>
              <Link
                href="#demo"
                className="bg-white text-primary-600 border border-primary-600 px-6 py-3 rounded-md font-medium hover:bg-primary-50 transition-colors text-center flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Watch Demo
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row gap-8 pt-6">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-primary-600">25,000+</span>
                <span className="text-gray-600">Active Users</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-primary-600">98%</span>
                <span className="text-gray-600">Customer Satisfaction</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="md:w-1/2 relative">
            <div className="bg-white rounded-lg shadow-xl p-2 relative z-10">
              <div className="bg-primary-50 rounded-md p-4">
                <div className="aspect-[4/3] relative bg-white rounded-md overflow-hidden shadow-sm">
                  {/* Placeholder for dashboard image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-4 p-6 w-full">
                      <div className="col-span-3 h-8 bg-primary-200 rounded-md"></div>
                      <div className="col-span-1 h-32 bg-primary-200 rounded-md"></div>
                      <div className="col-span-2 h-32 bg-primary-200 rounded-md"></div>
                      <div className="col-span-2 h-32 bg-primary-200 rounded-md"></div>
                      <div className="col-span-1 h-32 bg-primary-200 rounded-md"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Stats Cards */}
            <div className="absolute top-4 -right-4 bg-white rounded-lg shadow-lg p-3 flex items-center gap-3 z-20">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-500">Monthly Reports</div>
                <div className="text-sm font-medium text-green-600">+24%</div>
              </div>
            </div>

            <div className="absolute bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 flex items-center gap-3 z-20">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-500">User Engagement</div>
                <div className="text-sm font-medium text-primary-600">+42%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
