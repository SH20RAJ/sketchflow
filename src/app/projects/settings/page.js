"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  CreditCard, 
  Bell, 
  Shield, 
  Key,
  Loader2,
  ArrowLeft
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data: subscriptionData } = useSWR("/api/subscription", fetcher);
  const isPro = subscriptionData?.isPro;

  const handleNavigation = () => {
    setIsNavigating(true);
    router.push('/projects');
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Add save functionality here
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text mb-2">
            Settings
          </h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <Button
            onClick={handleNavigation}
            variant="outline"
            className="flex items-center"
            disabled={isNavigating}
          >
            {isNavigating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowLeft className="mr-2 h-4 w-4" />
            )}
            {isNavigating ? "Navigating..." : "Back to Projects"}
          </Button>
        </div>
      </nav>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your profile information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={session?.user?.image} alt={session?.user?.name} />
                  <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Avatar</Button>
              </div>
              <Separator />
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    defaultValue={session?.user?.name}
                    icon={User}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={session?.user?.email}
                    icon={Mail}
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Subscription & Billing</CardTitle>
              <CardDescription>
                Manage your subscription and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">Current Plan</p>
                  <div className="flex items-center gap-2">
                    <span className={isPro ? "text-blue-600" : "text-gray-600"}>
                      {isPro ? "Pro Plan" : "Free Plan"}
                    </span>
                    {isPro && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r from-blue-600/10 to-blue-400/10 text-blue-600 border border-blue-200 inline-flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Active
                      </span>
                    )}
                  </div>
                </div>
                <Button variant="outline" onClick={() => router.push('/subscription')}>
                  {isPro ? "Manage Plan" : "Upgrade to Pro"}
                </Button>
              </div>
              {isPro && subscriptionData?.subscription?.endDate && (
                <div className="text-sm text-gray-500">
                  Next billing date: {new Date(subscriptionData.subscription.endDate).toLocaleDateString()}
                </div>
              )}
              <Separator />
              <div className="space-y-4">
                <h3 className="font-medium">Payment Method</h3>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  {
                    title: "Email Notifications",
                    description: "Receive email notifications about your projects",
                    defaultChecked: true
                  },
                  {
                    title: "Project Updates",
                    description: "Get notified when changes are made to your projects",
                    defaultChecked: true
                  },
                  {
                    title: "Subscription Updates",
                    description: "Receive updates about your subscription status",
                    defaultChecked: true
                  },
                  {
                    title: "Marketing Emails",
                    description: "Receive emails about new features and promotions",
                    defaultChecked: false
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <Switch defaultChecked={item.defaultChecked} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    icon={Key}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    icon={Key}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    icon={Key}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end space-x-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </div>
  );
} 