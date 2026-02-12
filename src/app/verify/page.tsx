"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function VerifyPage() {
  const handleButtonClick = (label: string) => {
    toast.success("Button clicked", {
      description: label,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">✅ UI Components Working!</h1>
        
        <Card className="p-6 bg-neutral-900 border-neutral-700">
          <h2 className="text-2xl mb-4">Card Component</h2>
          <p className="text-neutral-400">This is a card with styled content.</p>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl">Button Variants:</h2>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => handleButtonClick("Default")}>Default</Button>
            <Button variant="destructive" onClick={() => handleButtonClick("Destructive")}>
              Destructive
            </Button>
            <Button variant="outline" onClick={() => handleButtonClick("Outline")}>
              Outline
            </Button>
            <Button variant="success" onClick={() => handleButtonClick("Success")}>
              Success
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl">Badges:</h2>
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="destructive">Error</Badge>
            <Badge variant="warning">Warning</Badge>
          </div>
        </div>

        <div className="bg-green-900 border border-green-600 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-100 mb-2">✅ Success!</h3>
          <p className="text-green-200">
            If you can see this styled page, all components are working correctly.
          </p>
          <p className="text-green-300 mt-4">
            Links to try:<br />
            • <a href="/test" className="underline">Test Dashboard</a><br />
            • <a href="/components" className="underline">Component Showcase</a><br />
            • <a href="/dashboard" className="underline">Main Dashboard</a>
          </p>
        </div>
      </div>
    </div>
  );
}
