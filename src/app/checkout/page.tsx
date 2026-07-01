import React from "react";
import { Button } from "@/components/ui/button";

// Checkout & Payment Redirect Page / പണമിടപാടുകൾക്കായുള്ള പ്രധാന പേജ്
export default function CheckoutPage() {
  return (
    // Centered layout with dark mode support / നടുവിലായി ക്രമീകരിച്ചിരിക്കുന്ന ലേഔട്ട്
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 text-center">
        
        <h1 className="text-3xl font-bold mb-4">Secure Checkout</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          Choose your preferred payment method.
          <br/>
          <span className="text-sm opacity-80">നിങ്ങളുടെ പേയ്മെന്റ് രീതി തിരഞ്ഞെടുക്കുക.</span>
        </p>

        <div className="space-y-4">
          {/* Razorpay Button - Popular in India / ഇന്ത്യയിൽ കൂടുതലായി ഉപയോഗിക്കുന്ന റേസർപേ */}
          <Button className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700">
            Pay via Razorpay (യു.പി.ഐ / കാർഡ്)
          </Button>

          {/* Stripe / Google Pay Button / സ്ട്രൈപ്പ് അല്ലെങ്കിൽ ഗൂഗിൾ പേ */}
          <Button variant="outline" className="w-full h-12 text-lg">
            Pay via Stripe (Google Pay / Apple Pay)
          </Button>
        </div>

        <p className="mt-8 text-xs text-zinc-500">
          Payment messages will be securely recorded in the Admin Dashboard.
          <br/>
          പണമിടപാട് വിവരങ്ങൾ അഡ്മിൻ പാനലിൽ സുരക്ഷിതമായി രേഖപ്പെടുത്തുന്നതാണ്.
        </p>
      </div>
    </main>
  );
}
