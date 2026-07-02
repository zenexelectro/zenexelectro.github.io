import UPIPayment from "@/components/UPIPayment";

export default function PayPage() {
  return (
    <div className="flex min-h-[calc(100vh-160px)] flex-col items-center justify-center p-8">
      <div className="mb-8 text-center max-w-lg">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Complete Your Payment</h1>
        <p className="text-muted-foreground">
          Use any UPI app (GPay, PhonePe, Paytm) to scan the code below. 
          Your transaction is end-to-end encrypted and verified securely on our Edge network.
        </p>
      </div>
      
      <UPIPayment amount="25000" orderId="ZNX-SEC-099" />
    </div>
  );
}
