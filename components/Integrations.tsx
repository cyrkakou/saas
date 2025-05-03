import React from 'react'
import Link from 'next/link'

export const Integrations = () => {
  // Array of integration logos (using placeholder SVGs)
  const integrations = Array(8).fill(null).map((_, index) => ({
    id: index + 1,
    color: ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-yellow-100', 'bg-red-100', 'bg-indigo-100', 'bg-pink-100', 'bg-teal-100'][index % 8],
    textColor: ['text-blue-600', 'text-green-600', 'text-purple-600', 'text-yellow-600', 'text-red-600', 'text-indigo-600', 'text-pink-600', 'text-teal-600'][index % 8],
  }))

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          Expand Your Reach with Integrations
        </h2>
        <p className="text-lg text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Connect with your favorite tools and platforms for a seamless workflow
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-12">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className={`${integration.color} ${integration.textColor} h-16 rounded-lg flex items-center justify-center shadow-sm`}
            >
              <div className="font-bold">LOGO {integration.id}</div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="#"
            className="bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors inline-flex items-center"
          >
            Explore All Integrations
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
