declare global {
  interface Window {
    /**
     * Navigate to the auth page with a custom redirect URL
     * @param redirectUrl - URL to redirect to after successful authentication
     */
    navigateToAuth: (redirectUrl: string) => void;
  }
}

declare module "@paystack/inline-js" {
  interface TransactionObject {
    reference: string;
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

export {};