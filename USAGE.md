# Using Cashfree Capacitor Plugin

## Installation

### 1. Install the Plugin

```bash
npm install capacitor-plugin-cashfree-pg
npx cap sync
```

### 2. iOS Setup (if targeting iOS)

```bash
cd ios && pod install && cd ..
```

## Enhanced Features with API Contract

✅ **Multiple Payment Methods** - Web Checkout, UPIIntent Checkout, Subscription Checkout  
✅ **Consistent API** - Same interface across Android and iOS  

## Integration Steps

### 1. Import with Type Safety

```typescript
import { CFPaymentGateway } from 'capacitor-plugin-cashfree-pg';
```

### 2. Complete Service Implementation

```typescript
// Start Web Checkout payment
window.startWebPayment = async () => {
  try {
    const result = await CFPaymentGateway.doWebCheckoutPayment({
      session: {
        payment_session_id: 'session_owAz-uWF2WEapSR5KgwUnmnQqRqqKsU9WK4QcuvgeBJk-nzMe4R2FYADT583rCUYx_WxhmNnx7PaaIeBWWTItjU0UeAf9uSKS_l0ZF6yrBWsNiOgynvRTAJfjzcpayment',
        orderID: 'devstudio_7359181814571428889',
        environment: 'SANDBOX',
      },
      theme: {
        navigationBarBackgroundColor: '#FF6B35',
        navigationBarTextColor: '#FFFFFF',
      },
    });

    console.log('Web Payment Result:', result);
    
    // Check if payment was successful or has errors
    if (result.error) {
      document.getElementById('webPaymentResult').innerHTML = `
              <h3>Web Payment Failed</h3>
              <p><strong>Order ID:</strong> ${result.orderID || 'N/A'}</p>
              <p><strong>Error:</strong> ${result.error}</p>
          `;
    } else {
      document.getElementById('webPaymentResult').innerHTML = `
              <h3>Web Payment Result</h3>
              <p><strong>Order ID:</strong> ${result.orderID}</p>
              <p><strong>Status:</strong> Verification needed - check with your backend</p>
          `;
    }
  } catch (error) {
    console.error('Web payment error:', error);
    document.getElementById('webPaymentResult').innerHTML = `
            <h3>Web Payment Error</h3>
            <p>${error.message}</p>
        `;
  }
};

// Start Subscription Checkout payment
window.startSubscriptionPayment = async () => {
  try {
    const result = await CFPaymentGateway.doSubscriptionPayment({
      session: {
        subscription_session_id: 'sub_session_rvdQ8okpc588vZREXqOshOS390phef04Vo66GOK-K-NRwmlFlAHhaEkCxkzgT7JkUIQ8HRb4SWpx3SUdQZcZ8bAHsMeFrpANACyD7M6L1lD4PQY7CLolHOZvSqYcu6opayment',
        subscription_id: 'devstudio_subs_7360376822904552076',
        environment: 'SANDBOX',
      },
      theme: {
        navigationBarBackgroundColor: '#FF6B35',
        navigationBarTextColor: '#FFFFFF',
      },
    });

    console.log('Subscription Payment Result:', result);
    
    // Check if payment was successful or has errors
    if (result.error) {
      document.getElementById('subscriptionPaymentResult').innerHTML = `
              <h3>Subscription Payment Failed</h3>
              <p><strong>Order ID:</strong> ${result.orderID || 'N/A'}</p>
              <p><strong>Error:</strong> ${result.error}</p>
          `;
    } else {
      document.getElementById('subscriptionPaymentResult').innerHTML = `
              <h3>Subscription Payment Result</h3>
              <p><strong>Order ID:</strong> ${result.orderID}</p>
              <p><strong>Status:</strong> Verification needed - check with your backend</p>
          `;
    }
  } catch (error) {
    console.error('Subscription payment error:', error);
    document.getElementById('subscriptionPaymentResult').innerHTML = `
            <h3>Subscription Payment Error</h3>
            <p>${error.message}</p>
        `;
  }
};

// Start UPI payment
window.startUPIPayment = async () => {
  try {
    const result = await CFPaymentGateway.doUPIPayment({
      session: {
        payment_session_id: 'session_owAz-uWF2WEapSR5KgwUnmnQqRqqKsU9WK4QcuvgeBJk-nzMe4R2FYADT583rCUYx_WxhmNnx7PaaIeBWWTItjU0UeAf9uSKS_l0ZF6yrBWsNiOgynvRTAJfjzcpayment',
        orderID: 'devstudio_7359181814571428889',
        environment: 'SANDBOX',
      },
      theme: {
        navigationBarBackgroundColor: '#FF6B35',
        navigationBarTextColor: '#FFFFFF',
        primaryTextColor: '#000000',
      },
    });

    console.log('UPI Payment Result:', result);
    
    // Check if payment was successful or has errors
    if (result.error) {
      document.getElementById('upiPaymentResult').innerHTML = `
              <h3>UPI Payment Failed</h3>
              <p><strong>Order ID:</strong> ${result.orderID || 'N/A'}</p>
              <p><strong>Error:</strong> ${result.error}</p>
          `;
    } else {
      document.getElementById('upiPaymentResult').innerHTML = `
              <h3>UPI Payment Result</h3>
              <p><strong>Order ID:</strong> ${result.orderID}</p>
              <p><strong>Status:</strong> Verification needed - check with your backend</p>
          `;
    }
  } catch (error) {
    console.error('UPI payment error:', error);
    document.getElementById('upiPaymentResult').innerHTML = `
            <h3>UPI Payment Error</h3>
            <p>${error.message}</p>
        `;
  }
};
```


## Payment Method Comparison

| Method | Best For | Platforms | Features |
|--------|----------|-----------|----------|
| **Web Checkout** | Web-like experience | Android, iOS | Browser-based UI |
| **UPI Payment** | UPI-specific flows | Android primarily | Direct UPI integration |
| **Subscription Checkout** | Subscription-specific flows | Android, iOS | Browser-based UI |



```bash
# Build for Android
npx cap build android
npx cap run android

# Build for iOS
npx cap build ios
npx cap run ios
```

## Troubleshooting

### Common Issues

1. **Environment Mismatch**: Check that the CFEnvironment enum is used correctly
2. **Session Token**: Verify the payment session token is valid and not expired
3. **Theme Issues**: Use proper color codes (hex format)

### Debug Steps

1. Check console logs for type validation errors
2. Verify the API contract package is properly installed
3. Ensure the payment session is created correctly on the backend
4. Test with different payment methods to isolate issues

## Support

For plugin-specific issues, create an issue on the GitHub repository.
For Cashfree payment gateway issues, please refer to the [Cashfree Documentation](https://www.cashfree.com/docs/payments/online/mobile/capacitor).
