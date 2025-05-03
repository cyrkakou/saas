'use client'

import { useState } from 'react'

export const FAQ = () => {
  const faqs = [
    {
      question: "What is a PowerBuilder report viewer?",
      answer: "A PowerBuilder report viewer is a tool that allows you to view, interact with, and share reports created in PowerBuilder without needing the original development environment. Our solution makes these reports accessible from any device with a web browser."
    },
    {
      question: "How does ReportFlow handle report security?",
      answer: "ReportFlow implements enterprise-grade security with end-to-end encryption, role-based access controls, and detailed audit logs. Your report data is always protected, both in transit and at rest."
    },
    {
      question: "Can I customize the look and feel of my reports?",
      answer: "Yes, ReportFlow offers extensive customization options. You can apply your brand colors, logos, and styling to reports. You can also create custom templates and interactive elements to enhance the user experience."
    },
    {
      question: "Is there an API available for integration?",
      answer: "Yes, ReportFlow provides a comprehensive REST API that allows you to integrate report viewing and management capabilities into your existing applications and workflows."
    },
    {
      question: "How do I migrate my existing PowerBuilder reports?",
      answer: "ReportFlow provides a simple migration tool that helps you convert your existing PowerBuilder reports to our platform. Our team can also provide professional services to assist with complex migrations."
    },
    {
      question: "What kind of support do you offer?",
      answer: "We offer different levels of support based on your plan. Free users get community support, Pro users receive priority email support, and Enterprise customers get dedicated account managers and 24/7 phone support."
    }
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          All Your Questions, Answered
        </h2>
        <div className="max-w-3xl mx-auto divide-y divide-gray-200">
          {faqs.map((faq, index) => (
            <div key={index} className="py-5">
              <button
                className="flex w-full items-start justify-between text-left"
                onClick={() => toggleFaq(index)}
              >
                <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                <span className="ml-6 flex-shrink-0">
                  {openIndex === index ? (
                    <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </span>
              </button>
              {openIndex === index && (
                <div className="mt-2 pr-12">
                  <p className="text-base text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
