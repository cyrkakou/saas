'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white py-4 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ReportFlow</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-indigo-600 font-medium">
              Features
            </Link>
            <Link href="#workflow" className="text-gray-600 hover:text-indigo-600 font-medium">
              Workflow
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-indigo-600 font-medium">
              Pricing
            </Link>
            <Link href="#faq" className="text-gray-600 hover:text-indigo-600 font-medium">
              FAQ
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/theme-customizer" className="text-gray-500 text-sm hover:text-primary-600">
              Theme Customizer
            </Link>
            <Link href="/login" className="text-gray-700 font-medium hover:text-primary-600">
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-primary-600 text-white px-4 py-2 rounded-md font-medium hover:bg-primary-700 transition-colors"
            >
              Start Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-500 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="#features"
                className="text-gray-600 hover:text-indigo-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#workflow"
                className="text-gray-600 hover:text-indigo-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Workflow
              </Link>
              <Link
                href="#pricing"
                className="text-gray-600 hover:text-indigo-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="#faq"
                className="text-gray-600 hover:text-indigo-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                <Link
                  href="/theme-customizer"
                  className="text-gray-500 text-sm hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Theme Customizer
                </Link>
                <Link
                  href="/login"
                  className="text-gray-700 font-medium hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md font-medium hover:bg-primary-700 transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Start Free
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
