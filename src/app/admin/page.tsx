"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AdminDashboard() {
  const [authKey, setAuthKey] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");

  const handlePublish = async () => {
    setStatus("Publishing securely...");
    try {
      const res = await fetch("/api/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authKey}`
        },
        body: JSON.stringify({ title, content })
      });

      const data = await res.json();
      
      if (res.ok) {
        setStatus("Published successfully. GitHub Webhook triggered build.");
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (e) {
      setStatus("Failed to communicate with Edge Webhook.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center p-8">
      <Card className="w-full max-w-2xl bg-card border-border">
        <CardHeader>
          <CardTitle>Admin Headless Publisher</CardTitle>
          <CardDescription>
            Publish updates securely. Triggers static CI/CD rebuilds at the Edge.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Admin Authorization Key</label>
            <Input 
              type="password"
              placeholder="Enter secure Edge Webhook Token" 
              value={authKey} 
              onChange={(e) => setAuthKey(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Post Title</label>
            <Input 
              placeholder="e.g. New CCTV Installation at TechPark" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Markdown Content</label>
            <textarea 
              className="w-full h-40 p-3 rounded-md bg-background border border-input text-foreground text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="# Project Details..." 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
            />
          </div>
          {status && <p className="text-sm font-semibold text-primary">{status}</p>}
        </CardContent>
        <CardFooter>
          <Button onClick={handlePublish} disabled={!authKey || !title || !content}>
            Secure Publish to CI/CD
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
