export interface CFPaymentGatewayPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
