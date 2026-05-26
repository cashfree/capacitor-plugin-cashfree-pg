import { CFPaymentGateway } from 'capacitor-plugin-cashfree-pg';
import { CapacitorHttp } from '@capacitor/core';

// ─── Config ──────────────────────────────────────────────────────────────────
// Switch environment here: 'SANDBOX' | 'PRODUCTION'
const CONFIG = {
  environment: 'SANDBOX',
  clientId: 'TEST430329ae80e0f32e41a393d78b923034',
  clientSecret: 'TESTaf195616268bd6202eeb3bf8dc458956e7192a85',
  apiVersion: '2025-01-01',
};

const API_BASE = {
  SANDBOX: 'https://sandbox.cashfree.com',
  PRODUCTION: 'https://api.cashfree.com',
};

// ─── Order Creation ───────────────────────────────────────────────────────────
async function createOrder() {
  const orderId = `example_${Date.now()}`;
  const response = await CapacitorHttp.post({
    url: `${API_BASE[CONFIG.environment]}/pg/orders`,
    headers: {
      'x-client-id': CONFIG.clientId,
      'x-client-secret': CONFIG.clientSecret,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-api-version': CONFIG.apiVersion,
    },
    data: {
      order_amount: 1.0,
      order_currency: 'INR',
      order_id: orderId,
      customer_details: {
        customer_id: 'devstudio_user',
        customer_phone: '9876543210',
      },
      order_meta: {
        return_url: `https://www.cashfree.com/devstudio/preview/pg/web/checkout?order_id={order_id}`,
      },
    },
  });

  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.data?.message || `Order creation failed (${response.status})`);
  }

  return {
    orderId: response.data.order_id,
    paymentSessionId: response.data.payment_session_id,
  };
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────
function setResult(elementId, html, isError = false) {
  const el = document.getElementById(elementId);
  el.className = `result${isError ? ' error' : ''}`;
  el.innerHTML = html;
  el.style.display = 'block';
}

function setLoading(elementId, message) {
  setResult(elementId, `<p>⏳ ${message}</p>`);
}

// ─── Payment Methods ──────────────────────────────────────────────────────────
window.startWebPayment = async () => {
  setLoading('webPaymentResult', 'Creating order...');
  try {
    const { orderId, paymentSessionId } = await createOrder();
    setLoading('webPaymentResult', `Order created: ${orderId}. Launching payment...`);

    const result = await CFPaymentGateway.doWebCheckoutPayment({
      session: {
        payment_session_id: paymentSessionId,
        orderID: orderId,
        environment: CONFIG.environment,
      },
      theme: {
        navigationBarBackgroundColor: '#FF6B35',
        navigationBarTextColor: '#FFFFFF',
      },
    });

    console.log('Web Payment Result:', result);
    if (result.error) {
      setResult('webPaymentResult', `<h3>Web Payment Failed</h3><p><strong>Order ID:</strong> ${result.orderID || orderId}</p><p><strong>Error:</strong> ${result.error}</p>`, true);
    } else {
      setResult('webPaymentResult', `<h3>Web Payment Initiated</h3><p><strong>Order ID:</strong> ${result.orderID}</p><p><strong>Status:</strong> Verify with your backend</p>`);
    }
  } catch (error) {
    console.error('Web payment error:', error);
    setResult('webPaymentResult', `<h3>Error</h3><p>${error.message}</p>`, true);
  }
};

window.startUPIPayment = async () => {
  setLoading('upiPaymentResult', 'Creating order...');
  try {
    const { orderId, paymentSessionId } = await createOrder();
    setLoading('upiPaymentResult', `Order created: ${orderId}. Launching UPI...`);

    const result = await CFPaymentGateway.doUPIPayment({
      session: {
        payment_session_id: paymentSessionId,
        orderID: orderId,
        environment: CONFIG.environment,
      },
      theme: {
        navigationBarBackgroundColor: '#FF6B35',
        navigationBarTextColor: '#FFFFFF',
        primaryTextColor: '#000000',
      },
    });

    console.log('UPI Payment Result:', result);
    if (result.error) {
      setResult('upiPaymentResult', `<h3>UPI Payment Failed</h3><p><strong>Order ID:</strong> ${result.orderID || orderId}</p><p><strong>Error:</strong> ${result.error}</p>`, true);
    } else {
      setResult('upiPaymentResult', `<h3>UPI Payment Initiated</h3><p><strong>Order ID:</strong> ${result.orderID}</p><p><strong>Status:</strong> Verify with your backend</p>`);
    }
  } catch (error) {
    console.error('UPI payment error:', error);
    setResult('upiPaymentResult', `<h3>Error</h3><p>${error.message}</p>`, true);
  }
};

window.startSubscriptionPayment = async () => {
  setLoading('subscriptionPaymentResult', 'Creating order...');
  try {
    const { orderId, paymentSessionId } = await createOrder();
    setLoading('subscriptionPaymentResult', `Order created: ${orderId}. Launching subscription...`);

    const result = await CFPaymentGateway.doSubscriptionPayment({
      session: {
        // Subscription checkout requires subscription_session_id + subscription_id.
        // A regular payment_session_id from /pg/orders is not valid here —
        // use the Cashfree Subscription API to get these values.
        subscription_session_id: paymentSessionId,
        subscription_id: orderId,
        environment: CONFIG.environment,
      },
      theme: {
        navigationBarBackgroundColor: '#FF6B35',
        navigationBarTextColor: '#FFFFFF',
      },
    });

    console.log('Subscription Payment Result:', result);
    if (result.error) {
      setResult('subscriptionPaymentResult', `<h3>Subscription Payment Failed</h3><p><strong>Order ID:</strong> ${result.orderID || orderId}</p><p><strong>Error:</strong> ${result.error}</p>`, true);
    } else {
      setResult('subscriptionPaymentResult', `<h3>Subscription Payment Initiated</h3><p><strong>Order ID:</strong> ${result.orderID}</p><p><strong>Status:</strong> Verify with your backend</p>`);
    }
  } catch (error) {
    console.error('Subscription payment error:', error);
    setResult('subscriptionPaymentResult', `<h3>Error</h3><p>${error.message}</p>`, true);
  }
};
