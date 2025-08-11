import type { CheckoutPayment } from 'cashfree-pg-api-contract';

export interface CFPaymentResult {
  orderID?: string;
  error?: string;
}

export interface CFPaymentGatewayPlugin {
  /**
   * Start payment process with Web Checkout
   */
  doWebCheckoutPayment(checkoutPayment: CheckoutPayment): Promise<CFPaymentResult>;

  /**
   * Start UPI Intent payment
   */
  doUPIPayment(checkoutPayment: CheckoutPayment): Promise<CFPaymentResult>;

  /**
   * Start Subscription Checkout payment
   */
  doSubscriptionPayment(checkoutPayment: CheckoutPayment): Promise<CFPaymentResult>;
}
