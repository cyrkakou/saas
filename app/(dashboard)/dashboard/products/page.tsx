"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/components/ui/card";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Products</h1>
      <p className="text-gray-500">Manage your products and services.</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Product A</CardTitle>
            <CardDescription>Basic subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$19.99/mo</div>
            <p className="text-sm text-gray-500">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Product B</CardTitle>
            <CardDescription>Premium subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$49.99/mo</div>
            <p className="text-sm text-gray-500">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Product C</CardTitle>
            <CardDescription>Enterprise subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$99.99/mo</div>
            <p className="text-sm text-gray-500">Inactive</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
