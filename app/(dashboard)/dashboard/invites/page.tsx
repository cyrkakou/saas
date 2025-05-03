"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/components/ui/card";

export default function InvitesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Invites</h1>
      <p className="text-gray-500">Manage your invitations and team members.</p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Invites</CardTitle>
            <CardDescription>Invitations waiting for response</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">jane.smith@example.com</h3>
                  <p className="text-sm text-gray-500">Sent 2 days ago</p>
                </div>
                <button className="text-sm text-red-600 hover:text-red-800">
                  Cancel
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">mark.johnson@example.com</h3>
                  <p className="text-sm text-gray-500">Sent 3 days ago</p>
                </div>
                <button className="text-sm text-red-600 hover:text-red-800">
                  Cancel
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">sarah.wilson@example.com</h3>
                  <p className="text-sm text-gray-500">Sent 5 days ago</p>
                </div>
                <button className="text-sm text-red-600 hover:text-red-800">
                  Cancel
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>People with access to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                    <span className="font-medium text-sm">JD</span>
                  </div>
                  <div>
                    <h3 className="font-medium">John Doe</h3>
                    <p className="text-sm text-gray-500">Owner</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">You</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <span className="font-medium text-sm">RB</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Robert Brown</h3>
                    <p className="text-sm text-gray-500">Admin</p>
                  </div>
                </div>
                <button className="text-sm text-red-600 hover:text-red-800">
                  Remove
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <span className="font-medium text-sm">AT</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Alice Taylor</h3>
                    <p className="text-sm text-gray-500">Member</p>
                  </div>
                </div>
                <button className="text-sm text-red-600 hover:text-red-800">
                  Remove
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
