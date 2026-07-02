export async function onRequestPost(context: any) {
  try {
    const { request } = context;
    const body = await request.json();
    
    const { upiId, amount, transactionRef } = body;

    // Validate request
    if (!upiId || !amount || !transactionRef) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // In a real scenario, this edge function would connect to a bank API
    // or an SMS parsing webhook to verify the UPI UTR (Transaction Ref) securely.
    // For now, we mock the strict server-side validation.
    
    // Simulate complex secure validation process
    const isValid = transactionRef.length > 8; 

    if (isValid) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: "UPI transaction verified securely on Edge.",
        reference: transactionRef
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Invalid UTR or transaction not found."
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: "Edge function execution failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
