import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-sm font-medium">Name</p>
            <p className="text-sm text-muted-foreground">Galen</p>
          </div>
          <div>
            <p className="text-sm font-medium">Role</p>
            <p className="text-sm text-muted-foreground">IT Manager</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Platform</CardTitle>
          <CardDescription>Additional features coming in future phases</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ul className="list-disc pl-4 space-y-1">
            <li>Theme toggle (light/dark mode)</li>
            <li>API key management for personal Claude access</li>
            <li>Notification preferences</li>
            <li>Data export</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
