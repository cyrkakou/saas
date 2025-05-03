import React from 'react'
import Link from 'next/link'

export const CTA = () => {
  return (
    <section className="py-16 md:py-24 bg-primary-600">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Take Control of Your PowerBuilder Reports Today!
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-lg mx-auto lg:mx-0">
              Join thousands of businesses that have transformed their reporting experience with ReportFlow.
            </p>
            <Link
              href="/register"
              className="inline-block bg-white text-primary-600 px-6 py-3 rounded-md font-medium hover:bg-primary-50 transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
          <div className="lg:w-1/2">
            <div className="bg-primary-500 rounded-lg p-6 shadow-lg">
              <div className="aspect-[4/3] relative bg-white rounded-md overflow-hidden shadow-sm">
                {/* Placeholder for CTA dashboard image */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white p-4">
                  <div className="h-8 bg-primary-100 rounded-md mb-4"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                      <div className="h-6 bg-primary-100 rounded-md mb-2"></div>
                      <div className="h-32 bg-primary-100 rounded-md"></div>
                    </div>
                    <div className="col-span-1">
                      <div className="h-6 bg-primary-100 rounded-md mb-2"></div>
                      <div className="h-32 bg-primary-100 rounded-md"></div>
                    </div>
                    <div className="col-span-2">
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
