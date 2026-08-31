declare module "@paystack/inline-js" {
  interface TransactionObject {
    reference: string;
    status: string;
    trans: string;
    message: string;
    channel: string;
    domain: string;
    amount: number;
    currency: string;
  }

  class PaystackPop {
    newTransaction(config: {
      key: string;
      email: string;
      amount: number;
      currency?: string;
      ref?: string;
      metadata?: Record<string, unknown>;
      onSuccess?: (transaction: TransactionObject) => void;
      onClose?: () => void;
    }): void;
  }

  export default PaystackPop;
}
