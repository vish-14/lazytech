declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay?: any;
  }
}

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export type CheckoutCustomer = {
  leadId?: string;
  name: string;
  email: string;
  phone: string;
};

/** Creates an order, opens Razorpay checkout and verifies the payment server-side. */
export async function startCheckout(
  customer: CheckoutCustomer,
): Promise<
  | { status: "paid"; builderNumber: number | null }
  | { status: "dismissed" }
  | { status: "error"; message: string }
> {
  const ok = await loadRazorpayScript();
  if (!ok) return { status: "error", message: "Payment window could not load." };

  const orderRes = await fetch("/api/razorpay/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer),
  });
  if (!orderRes.ok) return { status: "error", message: "Could not start payment." };
  const order = (await orderRes.json()) as {
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
  };

  return new Promise((resolve) => {
    const rzp = new window.Razorpay({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amount,
      currency: order.currency,
      name: "LazyTech",
      description: "Lazy Pass · 1 building year",
      prefill: { name: customer.name, email: customer.email, contact: customer.phone },
      theme: { color: "#E50027" },
      modal: { ondismiss: () => resolve({ status: "dismissed" }) },
      handler: async (response: Record<string, string>) => {
        const verify = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });
        if (!verify.ok) {
          resolve({ status: "error", message: "We couldn't confirm the payment." });
          return;
        }
        const body = (await verify.json().catch(() => ({}))) as { builderNumber?: number | null };
        resolve({ status: "paid", builderNumber: body.builderNumber ?? null });
      },
    });
    rzp.on("payment.failed", () =>
      resolve({ status: "error", message: "Payment failed. Please try again." }),
    );
    rzp.open();
  });
}
