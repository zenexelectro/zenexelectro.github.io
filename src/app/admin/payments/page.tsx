import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldAlert, IndianRupee, Clock, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic"; // Ensure fresh data on every load
export const runtime = 'edge';

// Admin Payment Verification Dashboard (Uneditable Log)
// മാറ്റങ്ങൾ വരുത്താൻ സാധിക്കാത്ത അഡ്മിൻ പേയ്മെന്റ് പരിശോധനാ പാനൽ
export default async function AdminPaymentsDashboard() {
  // 1. Security Check: Only zenexelectro@gmail.com can view this page
  // സുരക്ഷാ പരിശോധന: അഡ്മിന് മാത്രമേ ഈ പേജ് കാണാൻ സാധിക്കൂ
  const session = await auth();
  if (!session || session.user?.email !== "zenexelectro@gmail.com") {
    redirect("/api/auth/signin");
  }

  let payments: any[] = [];
  let errorMsg = "";

  // 2. Fetch all payment JSON files from GitHub 'POST/payments' directory
  // ഗിറ്റ്ഹബ്ബിലെ 'POST/payments' ഫോൾഡറിൽ നിന്നും ഇടപാടുകൾ എടുക്കുന്നു
  try {
    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
      errorMsg = "GITHUB_TOKEN is missing. Please add it to your environment variables.";
    } else {
      const dirRes = await fetch(`https://api.github.com/repos/zenexelectro/zenexelectro.github.io/contents/POST/payments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
        cache: 'no-store'
      });

      if (dirRes.ok) {
        const files = await dirRes.json();
        
        // Filter only .json files and fetch their contents
        // JSON ഫയലുകൾ മാത്രം വേർതിരിച്ചെടുക്കുന്നു
        const jsonFiles = files.filter((f: any) => f.name.endsWith('.json'));
        
        const fetchPromises = jsonFiles.map(async (file: any) => {
          const contentRes = await fetch(file.download_url, { cache: 'no-store' });
          if (contentRes.ok) {
            return await contentRes.json();
          }
          return null;
        });

        const results = await Promise.all(fetchPromises);
        payments = results.filter(p => p !== null);
        
        // Sort by newest first
        payments.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      } else if (dirRes.status !== 404) {
        errorMsg = "Failed to load payments from GitHub.";
      }
    }
  } catch (err: any) {
    errorMsg = err.message;
  }

  return (
    <div className="p-8 min-h-screen bg-neutral-950 text-white">
      <div className="flex items-center gap-3 mb-8">
        <ShieldAlert className="w-8 h-8 text-blue-500" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Direct UPI Payment Logs</h1>
          <p className="text-neutral-400">Strictly Read-Only Transaction Records (മാറ്റങ്ങൾ വരുത്താൻ സാധിക്കാത്ത റെക്കോർഡുകൾ)</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg mb-8">
          {errorMsg}
        </div>
      )}

      {payments.length === 0 && !errorMsg && (
        <div className="p-12 text-center border border-neutral-800 border-dashed rounded-xl text-neutral-500">
          No payment records found yet. (പേയ്മെന്റുകൾ ഒന്നും ഇതുവരെ ലഭിച്ചിട്ടില്ല)
        </div>
      )}

      <div className="grid gap-4">
        {payments.map((payment, index) => (
          <Card key={index} className="bg-neutral-900 border-neutral-800">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-mono tracking-wider text-blue-400">
                  UTR: {payment.utr}
                </CardTitle>
                <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  Verification Pending
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-neutral-800/50">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Customer Name (ഉപഭോക്താവ്)</p>
                  <p className="font-medium text-white">{payment.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Amount (തുക)</p>
                  <p className="font-bold text-xl text-white flex items-center gap-1">
                    <IndianRupee className="w-5 h-5 text-neutral-400" />
                    {payment.amount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Date & Time (സമയം)</p>
                  <p className="text-neutral-300">
                    {new Date(payment.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Action (പരിശോധന)</p>
                  <p className="text-xs text-neutral-400">
                    Check your Bank/UPI App for UTR matching. This record cannot be edited here.
                    <br/>
                    (നിങ്ങളുടെ ബാങ്ക് അക്കൗണ്ടിൽ തുക വന്നിട്ടുണ്ടോ എന്ന് പരിശോധിക്കുക)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
