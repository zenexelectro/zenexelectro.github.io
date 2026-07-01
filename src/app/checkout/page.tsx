"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, ShieldCheck, CreditCard } from "lucide-react";

// UPI Direct Checkout Page
// നേരിട്ടുള്ള യു.പി.ഐ പേയ്മെന്റ് പേജ്
export default function CheckoutPage() {
  const [utr, setUtr] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Payment Details (Can be passed via state or props in a real cart)
  // തുകയുടെ വിവരങ്ങൾ
  const amount = 5000; 
  const merchantName = "Zenex Electronics";
  const merchantUPI = "merchant@upi"; // Change this to your real UPI ID / നിങ്ങളുടെ യഥാർത്ഥ UPI ഐഡി ഇവിടെ നൽകുക

  // Create the standard UPI Intent Link string
  // യു.പി.ഐ ആപ്പുകൾക്ക് പേയ്മെന്റ് മനസ്സിലാക്കാനുള്ള ലിങ്ക്
  const upiLink = `upi://pay?pa=${merchantUPI}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (utr.length !== 12) {
      setError("UTR / Transaction ID must be exactly 12 digits (UTR നമ്പർ 12 അക്കങ്ങൾ ആയിരിക്കണം).");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          utr,
          customerName,
          amount,
          items: ["Sample Product"]
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Payment submission failed.");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-neutral-900 border-neutral-800 p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-500/10 rounded-xl">
            <CreditCard className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Secure UPI Checkout</h1>
            <p className="text-neutral-400">0% Gateway Fees. Direct Transfer.</p>
          </div>
        </div>

        {isSuccess ? (
          // Success Screen / പണമടച്ചതിന് ശേഷമുള്ള സ്ക്രീൻ
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Payment Under Verification</h2>
            <p className="text-neutral-400 mb-8 max-w-md mx-auto">
              Thank you! Your UTR number <span className="text-white font-mono">{utr}</span> has been securely submitted. Our team will verify it shortly.
              <br /><br />
              നിങ്ങളുടെ പേയ്മെന്റ് വിവരങ്ങൾ ഞങ്ങൾക്ക് ലഭിച്ചിട്ടുണ്ട്. പരിശോധിച്ച ശേഷം ഓർഡർ പൂർത്തിയാക്കുന്നതാണ്.
            </p>
            <Button onClick={() => window.location.href = '/'} className="bg-blue-600 hover:bg-blue-700">
              Return to Home
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Step 1: Scan and Pay / സ്കാൻ ചെയ്ത് പണമടക്കുക */}
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl">
              <h3 className="text-neutral-900 font-bold mb-6 text-lg">1. Scan with any UPI App</h3>
              <div className="p-4 border-2 border-neutral-100 rounded-xl mb-4">
                <QRCodeSVG value={upiLink} size={200} />
              </div>
              <div className="text-center">
                <p className="text-neutral-500 text-sm mb-1">Paying to: {merchantName}</p>
                <p className="text-neutral-900 font-bold text-2xl">₹{amount}</p>
              </div>
              
              {/* Mobile Pay Button (Only works on phones with UPI apps installed) */}
              {/* മൊബൈൽ ഫോണുകൾക്ക് വേണ്ടിയുള്ള ബട്ടൺ */}
              <a href={upiLink} className="md:hidden mt-6 w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                  Pay Now via UPI App
                </Button>
              </a>
            </div>

            {/* Step 2: Verification Form / പരിശോധിക്കുന്നതിനുള്ള ഫോം */}
            <div>
              <h3 className="font-bold mb-6 text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-500" /> 
                2. Verify Payment
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name (നിങ്ങളുടെ പേര്)</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter your name" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="bg-neutral-950 border-neutral-800"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="utr">12-Digit UTR / Ref Number (റെഫറൻസ് നമ്പർ)</Label>
                  <Input 
                    id="utr" 
                    placeholder="E.g. 312345678901" 
                    value={utr}
                    onChange={(e) => setUtr(e.target.value.replace(/\D/g, '').slice(0, 12))}
                    className="bg-neutral-950 border-neutral-800 font-mono"
                    maxLength={12}
                    required
                  />
                  <p className="text-xs text-neutral-500">
                    Find the 12-digit UTR/UPI Ref No in your GPay/PhonePe history after payment.
                  </p>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting || utr.length !== 12}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? "Verifying..." : "Submit Payment for Verification"}
                </Button>
              </form>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
