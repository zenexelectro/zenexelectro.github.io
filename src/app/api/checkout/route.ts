import { NextResponse } from 'next/server';

// Serverless API for Direct UPI Payment Verification
// നേരിട്ടുള്ള യു.പി.ഐ പേയ്മെന്റ് പരിശോധിക്കുന്നതിനുള്ള സർവർലെസ്സ് API
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { utr, amount, customerName, items } = body;

    // Validation: UTR must be exactly 12 digits long
    // പരിശോധന: UTR കൃത്യമായി 12 അക്കങ്ങൾ ഉള്ളതായിരിക്കണം
    if (!utr || utr.length < 12) {
      return NextResponse.json(
        { error: "Invalid UTR. Please enter a valid 12-digit transaction ID." },
        { status: 400 }
      );
    }

    // Create the transaction record
    // ഇടപാടിന്റെ വിവരങ്ങൾ തയ്യാറാക്കുന്നു
    const paymentRecord = {
      utr,
      amount,
      customerName,
      items: items || [],
      status: 'pending', // Will be verified by admin / അഡ്മിൻ പരിശോധിച്ച ശേഷം മാറും
      timestamp: new Date().toISOString()
    };

    // GitHub API details to save the transaction as a JSON file
    // ഗിറ്റ്ഹബ്ബിലേക്ക് വിവരങ്ങൾ JSON ഫയൽ ആയി സേവ് ചെയ്യാനുള്ള സെറ്റിങ്സ്
    const token = process.env.GITHUB_TOKEN; // Ensure you add this in Cloudflare variables
    const owner = "zenexelectro";
    const repo = "zenexelectro.github.io";
    const path = `POST/payments/txn_${utr}_${Date.now()}.json`;
    
    const contentBase64 = Buffer.from(JSON.stringify(paymentRecord, null, 2)).toString('base64');

    // Save directly to the GitHub POST/payments folder
    // ഗിറ്റ്ഹബ്ബിലെ POST/payments ഫോൾഡറിലേക്ക് നേരിട്ട് സേവ് ചെയ്യുന്നു
    const githubRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `New Payment Received: UTR ${utr}`,
        content: contentBase64,
      })
    });

    if (!githubRes.ok) {
       console.error("GitHub API Error", await githubRes.text());
       return NextResponse.json(
         { error: "Failed to save transaction. Please contact support." },
         { status: 500 }
       );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Payment successfully submitted for verification!" 
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
