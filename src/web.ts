import { WebPlugin } from '@capacitor/core';
import type { CheckoutPayment } from 'cashfree-pg-api-contract';

import type { CFPaymentGatewayPlugin, CFPaymentResult } from './definitions';

export class CFPaymentGatewayWeb extends WebPlugin implements CFPaymentGatewayPlugin {
  async doWebCheckoutPayment(webCheckoutPaymentObject: CheckoutPayment): Promise<CFPaymentResult> {
    console.log('DO_WEB_PAYMENT', webCheckoutPaymentObject);
    throw new Error('Cashfree Payment Gateway is not supported on web platform. Use it on mobile devices only.');
  }

  async doUPIPayment(upiCheckoutPaymentObjections: CheckoutPayment): Promise<CFPaymentResult> {
    console.log('DO_UPI_PAYMENT', upiCheckoutPaymentObjections);
    throw new Error('UPI Payment is not supported on web platform. Use it on mobile devices only.');
  }

  async doSubscriptionPayment(subscriptionCheckoutPaymentObject: CheckoutPayment): Promise<CFPaymentResult> {
    console.log('DO_SUBSCRIPTION_PAYMENT', subscriptionCheckoutPaymentObject);
    throw new Error('Subscription Payment is not supported on web platform. Use it on mobile devices only.');
  }
}
