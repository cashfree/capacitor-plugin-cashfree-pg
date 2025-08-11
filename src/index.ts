import { registerPlugin } from '@capacitor/core';

import type { CFPaymentGatewayPlugin } from './definitions';

const CFPaymentGateway = registerPlugin<CFPaymentGatewayPlugin>('CFPaymentGateway', {
  web: () => import('./web').then((m) => new m.CFPaymentGatewayWeb()),
});

export * from './definitions';
export * from './web';
export { CFPaymentGateway };
