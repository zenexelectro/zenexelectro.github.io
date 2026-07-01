import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Admin Payment Dashboard (Uneditable logs) / എഡിറ്റ് ചെയ്യാൻ സാധിക്കാത്ത പേയ്മെന്റ് ഡാഷ്ബോർഡ്
export default function AdminPaymentDashboard() {
  // Mock data for payment logs / പണമിടപാടുകളുടെ വിവരങ്ങൾ
  const paymentLogs = [
    { id: "TXN123", status: "Success", amount: "₹4500", date: "2026-07-01", method: "Razorpay" },
    { id: "TXN124", status: "Failed", amount: "₹1200", date: "2026-07-01", method: "Stripe" },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Payment Dashboard (പേയ്മെന്റ് ലോഗുകൾ)</h1>
      <p className="text-zinc-500">Uneditable system logs for all transactions. / മാറ്റങ്ങൾ വരുത്താൻ സാധിക്കാത്ത സുരക്ഷിതമായ രേഖകൾ.</p>

      <div className="grid gap-4">
        {paymentLogs.map((log) => (
          <Card key={log.id} className="bg-zinc-100 dark:bg-zinc-900 border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between">
                <span>{log.id} - {log.method}</span>
                {/* Color coded status / സ്റ്റാറ്റസ് അനുസരിച്ച് നിറം മാറ്റുന്നു */}
                <span className={log.status === "Success" ? "text-green-600" : "text-red-600"}>
                  {log.status}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono">Amount: {log.amount}</p>
              <p className="text-sm text-zinc-500">Date: {log.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
