"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { QrCode, CheckCircle2, AlertCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function UPIPayment({ amount = "1000", orderId = "ZNX-12345" }) {
  const [utr, setUtr] = useState("");
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const upiId = "zenex@upi";

  const handleVerify = async () => {
    if (!utr) return;
    setStatus("verifying");
    
    try {
      // Calls the Cloudflare Edge Function
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upiId, amount, transactionRef: utr }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  const upiUrl = `upi://pay?pa=${upiId}&pn=ZenexSystems&am=${amount}&tr=${orderId}&cu=INR`;

  return (
    <Card className="w-full max-w-md mx-auto bg-card/50 backdrop-blur border-border/50 glow-card relative overflow-hidden">
      {status === "success" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-10 bg-green-950/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6"
        >
          <CheckCircle2 className="w-20 h-20 text-green-400 mb-4" />
          <h3 className="text-2xl font-bold text-green-400 mb-2">Payment Verified!</h3>
          <p className="text-green-200">Your direct UPI transaction has been securely verified on our Edge network.</p>
        </motion.div>
      )}

      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Direct UPI Payment</CardTitle>
        <CardDescription>Zero gateway fees. Secure Edge validation.</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Mock QR Code Box */}
        <div className="mx-auto w-48 h-48 bg-white rounded-xl flex items-center justify-center relative shadow-inner">
           <QrCode className="w-32 h-32 text-slate-900" />
           <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold text-slate-900 bg-white px-2 py-1 rounded">SCAN TO PAY</span>
           </div>
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-3xl font-bold text-primary-foreground">₹{amount}</p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>UPI ID: {upiId}</span>
            <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => navigator.clipboard.writeText(upiId)}>
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground/80">Enter 12-digit UTR/Reference Number</label>
          <Input 
            placeholder="e.g. 312345678901" 
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
            className="h-12 bg-background/50"
          />
          {status === "error" && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> Invalid UTR or verification failed.
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          className="w-full h-12 text-lg" 
          onClick={handleVerify}
          disabled={status === "verifying" || !utr}
        >
          {status === "verifying" ? "Verifying at Edge..." : "Verify Payment"}
        </Button>
      </CardFooter>
    </Card>
  );
}
