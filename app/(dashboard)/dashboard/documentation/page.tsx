"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/components/ui/card";

export default function DocumentationPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Documentation</h1>
      <p className="text-gray-500">Access guides, tutorials, and API documentation.</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Learn the basics of our platform</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              A comprehensive guide to help you get started with our platform, including account setup, navigation, and basic features.
            </p>
            <div className="mt-4 text-primary-600 text-sm font-medium">Read more →</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle>API Reference</CardTitle>
            <CardDescription>Detailed API documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Complete API reference documentation, including endpoints, parameters, response formats, and authentication.
            </p>
            <div className="mt-4 text-primary-600 text-sm font-medium">Read more →</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle>Tutorials</CardTitle>
            <CardDescription>Step-by-step guides</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Detailed tutorials for common tasks and advanced features, with examples and best practices.
            </p>
            <div className="mt-4 text-primary-600 text-sm font-medium">Read more →</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle>Integration Guides</CardTitle>
            <CardDescription>Connect with other services</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Learn how to integrate our platform with other services and tools in your workflow.
            </p>
            <div className="mt-4 text-primary-600 text-sm font-medium">Read more →</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle>FAQs</CardTitle>
            <CardDescription>Frequently asked questions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Answers to common questions about our platform, features, billing, and more.
            </p>
            <div className="mt-4 text-primary-600 text-sm font-medium">Read more →</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle>Release Notes</CardTitle>
            <CardDescription>Latest updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Stay up-to-date with the latest features, improvements, and bug fixes in our platform.
            </p>
            <div className="mt-4 text-primary-600 text-sm font-medium">Read more →</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
