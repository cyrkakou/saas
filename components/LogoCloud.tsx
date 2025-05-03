import React from 'react'

export const LogoCloud = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <p className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider mb-8">
          TRUSTED BY LEADING COMPANIES
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {/* These are placeholder logos - in a real app, you'd use actual company logos */}
          <div className="h-8 text-gray-400 flex items-center">
            <svg className="h-full" viewBox="0 0 100 30" fill="currentColor">
              <path d="M20 5h-5v20h5V5zm-10 0H5v20h5V5zm5 5h-5v15h5V10zm30-5h-5v20h5V5zm-10 0h-5v20h5V5zm5 5h-5v15h5V10z" />
            </svg>
          </div>
          <div className="h-8 text-gray-400 flex items-center">
            <svg className="h-full" viewBox="0 0 100 30" fill="currentColor">
              <path d="M40 5H5v5h35V5zm0 15H5v5h35v-5zm0-7.5H5v5h35v-5zM65 5h30v5H65V5zm0 15h30v5H65v-5zm0-7.5h30v5H65v-5z" />
            </svg>
          </div>
          <div className="h-8 text-gray-400 flex items-center">
            <svg className="h-full" viewBox="0 0 100 30" fill="currentColor">
              <circle cx="50" cy="15" r="10" />
              <path d="M25 15c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zm40 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10z" />
            </svg>
          </div>
          <div className="h-8 text-gray-400 flex items-center">
            <svg className="h-full" viewBox="0 0 100 30" fill="currentColor">
              <path d="M20 5L5 15l15 10V5zm30 0v20l15-10-15-10zm15 10l15 10V5L65 15z" />
            </svg>
          </div>
          <div className="h-8 text-gray-400 flex items-center">
            <svg className="h-full" viewBox="0 0 100 30" fill="currentColor">
              <rect x="5" y="5" width="90" height="20" rx="10" />
              <rect x="15" y="10" width="70" height="10" rx="5" fill="white" />
            </svg>
          </div>
          <div className="h-8 text-gray-400 flex items-center">
            <svg className="h-full" viewBox="0 0 100 30" fill="currentColor">
              <path d="M30 5H5v20h25V5zm40 0H45v20h25V5z" />
              <path d="M35 5h5v20h-5V5zm25 0h5v20h-5V5z" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
