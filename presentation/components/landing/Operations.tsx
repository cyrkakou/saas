import React from 'react'
import Link from 'next/link'

export const Operations = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Streamline Your Operations
        </h2>
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Effortless Report Management</h3>
            <p className="text-lg text-gray-600">
              Organize all your PowerBuilder reports in one centralized location with powerful search and filtering capabilities.
            </p>
            <ul className="space-y-3">
              {[
                "Centralized report repository",
                "Version control and history",
                "Advanced search and filtering"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="mt-1 w-5 h-5 rounded-full bg-success/20 text-success flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
            <div>
              <Link
                href="#"
                className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
              >
                Learn More
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="bg-primary-50 rounded-lg p-6 shadow-sm">
              <div className="aspect-[4/3] relative bg-white rounded-md overflow-hidden shadow-sm">
                {/* Placeholder for operations dashboard image */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white p-4">
                  <div className="h-8 bg-primary-100 rounded-md mb-4"></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <div className="h-6 bg-primary-100 rounded-md mb-2"></div>
                      <div className="h-24 bg-primary-100 rounded-md"></div>
                    </div>
                    <div className="col-span-2">
                      <div className="h-6 bg-primary-100 rounded-md mb-2"></div>
                      <div className="h-24 bg-primary-100 rounded-md"></div>
                    </div>
                    <div className="col-span-3">
                      <div className="h-6 bg-primary-100 rounded-md mb-2"></div>
                      <div className="h-24 bg-primary-100 rounded-md"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
