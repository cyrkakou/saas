"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/components/ui/card";

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Account</h1>
      <p className="text-gray-500">Manage your account settings and preferences.</p>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your personal information and account details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="text-base">John Doe</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="text-base">john.doe@example.com</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Account Type</h3>
              <p className="text-base">Premium</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
              <p className="text-base">January 15, 2023</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
