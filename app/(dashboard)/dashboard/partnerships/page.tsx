"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/components/ui/card";

export default function PartnershipsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Partnerships</h1>
      <p className="text-gray-500">Manage your partnerships and collaborations.</p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active Partnerships</CardTitle>
            <CardDescription>Your current partnerships</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Acme Inc.</h3>
                  <p className="text-sm text-gray-500">Technology Partner</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">TechCorp</h3>
                  <p className="text-sm text-gray-500">Integration Partner</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Global Solutions</h3>
                  <p className="text-sm text-gray-500">Reseller Partner</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Active
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Partnership Opportunities</CardTitle>
            <CardDescription>Potential new partnerships</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Innovate Ltd.</h3>
                  <p className="text-sm text-gray-500">Technology Partner</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                  Pending
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">NextGen Systems</h3>
                  <p className="text-sm text-gray-500">Integration Partner</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                  Pending
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Digital Frontiers</h3>
                  <p className="text-sm text-gray-500">Reseller Partner</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                  Pending
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
