'use client'

import { useState } from 'react'
import Link from 'next/link'

export const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: "Free",
      price: isAnnual ? "$0" : "$0",
      description: "Perfect for individuals getting started",
      features: [
        "Up to 5 reports",
        "Basic viewing options",
        "1 user account",
        "Community support"
      ],
      cta: "Get Started",
      ctaLink: "/register",
      popular: false
    },
    {
      name: "Pro",
      price: isAnnual ? "$29" : "$39",
      period: "/month",
      description: "Ideal for small teams and businesses",
      features: [
        "Unlimited reports",
        "Advanced viewing options",
        "Up to 10 user accounts",
        "Priority email support",
        "Custom branding",
        "API access"
      ],
      cta: "Get Started",
      ctaLink: "/register",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with specific needs",
      features: [
        "Everything in Pro",
        "Unlimited user accounts",
        "Dedicated account manager",
        "24/7 phone support",
        "Custom integrations",
        "On-premise deployment option"
      ],
      cta: "Contact Sales",
      ctaLink: "/contact",
      popular: false
    }
  ]

  return (
    <section id="pricing" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Flexible Plans for Every Need
        </h2>
        
        {/* Pricing Toggle */}
        <div className="flex items-center justify-center mb-12">
          <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
          <button 
            className="relative mx-4 h-6 w-12 rounded-full bg-indigo-200 focus:outline-none"
            onClick={() => setIsAnnual(!isAnnual)}
          >
            <span 
              className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${isAnnual ? 'translate-x-6' : ''}`}
            />
          </button>
          <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
            Annual
            <span className="ml-1.5 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
              Save 20%
            </span>
          </span>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-xl shadow-sm border ${plan.popular ? 'border-indigo-200 ring-2 ring-indigo-600 ring-opacity-20' : 'border-gray-200'} p-8 relative`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-500 ml-1">{plan.period}</span>}
                </div>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link 
                href={plan.ctaLink} 
                className={`block w-full text-center py-2 px-4 rounded-md font-medium ${
                  plan.popular 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
                } transition-colors`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
