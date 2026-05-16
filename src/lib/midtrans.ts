import midtransClient from "midtrans-client";

// Add type declaration for Snap class
declare module 'midtrans-client' {
  interface Snap {
    transaction: {
      status(transactionToken: string): Promise<any>;
    }
  }
}

// Check for required environment variables
const serverKey = process.env.MIDTRANS_SERVER_KEY;
if (!serverKey) {
  throw new Error("MIDTRANS_SERVER_KEY is not defined in environment variables");
}

export const snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === "production",
  serverKey: serverKey || "",
});
