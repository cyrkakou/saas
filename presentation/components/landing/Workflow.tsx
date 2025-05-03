import React from 'react'

export const Workflow = () => {
  const steps = [
    {
      number: 1,
      title: "Upload Reports",
      description: "Easily upload your PowerBuilder reports through our intuitive interface or API integration."
    },
    {
      number: 2,
      title: "Configure Viewing Options",
      description: "Set up custom viewing options, permissions, and interactive elements for your reports."
    },
    {
      number: 3,
      title: "Share & Collaborate",
      description: "Share reports with your team or clients and collaborate with comments and annotations."
    },
    {
      number: 4,
      title: "Analyze & Act",
      description: "Gain insights from your reports with our analytics tools and take action based on data."
    }
  ]

  return (
    <section id="workflow" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Simplify Your Workflow
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              
              {/* Connector line (only for non-last items) */}
              {step.number < steps.length && (
                <div className="hidden lg:block absolute top-10 -right-4 w-8 h-0.5 bg-indigo-200 z-10"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
