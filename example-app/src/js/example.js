import { CFPaymentGateway } from 'capacitor-plugin-cashfree-pg';

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
