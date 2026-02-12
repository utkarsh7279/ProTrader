"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Zap, Check, X, AlertTriangle } from "lucide-react";

export default function ComponentsShowcase() {
  const [selectValue, setSelectValue] = useState("");
  const handleDemoClick = (label: string) => {
    toast.success("Button clicked", {
      description: label,
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Component Showcase</h1>
          <p className="text-neutral-400">All shadcn/ui components in your project</p>
        </div>

        {/* Buttons Section */}
        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Buttons</CardTitle>
            <CardDescription>All button variants and sizes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-neutral-400 mb-3">Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="default" onClick={() => handleDemoClick("Default")}>Default</Button>
                <Button variant="destructive" onClick={() => handleDemoClick("Destructive")}>Destructive</Button>
                <Button variant="outline" onClick={() => handleDemoClick("Outline")}>Outline</Button>
                <Button variant="secondary" onClick={() => handleDemoClick("Secondary")}>Secondary</Button>
                <Button variant="ghost" onClick={() => handleDemoClick("Ghost")}>Ghost</Button>
                <Button variant="link" onClick={() => handleDemoClick("Link")}>Link</Button>
                <Button variant="success" onClick={() => handleDemoClick("Success")}>Success</Button>
                <Button variant="warning" onClick={() => handleDemoClick("Warning")}>Warning</Button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-400 mb-3">Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm" onClick={() => handleDemoClick("Small")}>Small</Button>
                <Button size="default" onClick={() => handleDemoClick("Default")}>Default</Button>
                <Button size="lg" onClick={() => handleDemoClick("Large")}>Large</Button>
                <Button size="icon" onClick={() => handleDemoClick("Icon")}><Zap className="w-4 h-4" /></Button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-400 mb-3">With Icons</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="success" onClick={() => handleDemoClick("Confirm")}>
                  <Check className="w-4 h-4 mr-2" />
                  Confirm
                </Button>
                <Button variant="destructive" onClick={() => handleDemoClick("Cancel")}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button variant="warning" onClick={() => handleDemoClick("Warning")}>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Warning
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges Section */}
        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Badges</CardTitle>
            <CardDescription>Status indicators and labels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Cards Section */}
        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Cards</CardTitle>
            <CardDescription>Container components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-neutral-900 border-neutral-700">
                <CardHeader>
                  <CardTitle className="text-base text-white">Card Title</CardTitle>
                  <CardDescription>Card description text</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-400">Card content goes here</p>
                </CardContent>
              </Card>
              <Card className="bg-neutral-900 border-emerald-700">
                <CardHeader>
                  <CardTitle className="text-base text-white">Success Card</CardTitle>
                  <CardDescription>With colored border</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="success">Active</Badge>
                </CardContent>
              </Card>
              <Card className="bg-neutral-900 border-red-700">
                <CardHeader>
                  <CardTitle className="text-base text-white">Error Card</CardTitle>
                  <CardDescription>With colored border</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="destructive">Failed</Badge>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Forms Section */}
        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Form Elements</CardTitle>
            <CardDescription>Inputs, labels, and selects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="text-input">Text Input</Label>
                <Input id="text-input" placeholder="Enter text..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="number-input">Number Input</Label>
                <Input id="number-input" type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="select">Select Dropdown</Label>
                <Select value={selectValue} onValueChange={setSelectValue}>
                  <SelectTrigger id="select">
                    <SelectValue placeholder="Choose option..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="disabled-input">Disabled Input</Label>
                <Input id="disabled-input" disabled placeholder="Disabled..." />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dialogs Section */}
        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Dialogs & Modals</CardTitle>
            <CardDescription>Popup dialogs and confirmations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dialog Title</DialogTitle>
                    <DialogDescription>
                      This is a dialog description. You can put any content here.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-neutral-400">Dialog content goes here...</p>
                  </div>
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Open Alert</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        {/* Toast Notifications */}
        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Toast Notifications</CardTitle>
            <CardDescription>Toast messages using Sonner</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => toast.success("Success!", { description: "Operation completed" })}>
                Success Toast
              </Button>
              <Button onClick={() => toast.error("Error!", { description: "Something went wrong" })} variant="destructive">
                Error Toast
              </Button>
              <Button onClick={() => toast.info("Info", { description: "This is informational" })} variant="outline">
                Info Toast
              </Button>
              <Button onClick={() => toast.warning("Warning!", { description: "Please be careful" })} variant="warning">
                Warning Toast
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table Example */}
        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Table Example</CardTitle>
            <CardDescription>Data table with styling</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-800">
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-neutral-400">Value</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-neutral-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-neutral-800/50 hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3 px-4 text-white">Item 1</td>
                    <td className="py-3 px-4"><Badge variant="success">Active</Badge></td>
                    <td className="py-3 px-4 text-right text-neutral-300">$1,234</td>
                    <td className="py-3 px-4 text-right">
                      <Button size="sm" variant="outline" onClick={() => handleDemoClick("Edit Item 1")}>
                        Edit
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b border-neutral-800/50 hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3 px-4 text-white">Item 2</td>
                    <td className="py-3 px-4"><Badge variant="warning">Pending</Badge></td>
                    <td className="py-3 px-4 text-right text-neutral-300">$5,678</td>
                    <td className="py-3 px-4 text-right">
                      <Button size="sm" variant="outline" onClick={() => handleDemoClick("Edit Item 2")}>
                        Edit
                      </Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3 px-4 text-white">Item 3</td>
                    <td className="py-3 px-4"><Badge variant="destructive">Inactive</Badge></td>
                    <td className="py-3 px-4 text-right text-neutral-300">$9,012</td>
                    <td className="py-3 px-4 text-right">
                      <Button size="sm" variant="outline" onClick={() => handleDemoClick("Edit Item 3")}>
                        Edit
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
