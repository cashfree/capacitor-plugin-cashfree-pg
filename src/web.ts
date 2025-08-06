import { WebPlugin } from '@capacitor/core';

import type { CFPaymentGatewayPlugin } from './definitions';

export class CFPaymentGatewayWeb extends WebPlugin implements CFPaymentGatewayPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
