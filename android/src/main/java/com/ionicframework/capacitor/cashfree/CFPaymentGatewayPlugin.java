package com.ionicframework.capacitor.cashfree;

import com.cashfree.pg.api.CFPaymentGatewayService;
import com.cashfree.pg.core.api.CFSession;
import com.cashfree.pg.core.api.CFSubscriptionSession;
import com.cashfree.pg.core.api.base.CFPayment;
import com.cashfree.pg.core.api.callback.CFCheckoutResponseCallback;
import com.cashfree.pg.core.api.callback.CFSubscriptionResponseCallback;
import com.cashfree.pg.core.api.exception.CFInvalidArgumentException;
import com.cashfree.pg.core.api.subscription.CFSubscriptionPayment;
import com.cashfree.pg.core.api.utils.CFErrorResponse;
import com.cashfree.pg.core.api.utils.CFSubscriptionResponse;
import com.cashfree.pg.core.api.webcheckout.CFWebCheckoutPayment;
import com.cashfree.pg.core.api.webcheckout.CFWebCheckoutTheme;
import com.cashfree.pg.ui.api.upi.intent.CFIntentTheme;
import com.cashfree.pg.ui.api.upi.intent.CFUPIIntentCheckoutPayment;
import com.getcapacitor.JSObject;
import com.getcapacitor.Logger;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import org.json.JSONObject;

@CapacitorPlugin(name = "CFPaymentGateway")
public class CFPaymentGatewayPlugin extends Plugin implements CFCheckoutResponseCallback, CFSubscriptionResponseCallback {

    private static final String CF_CAP_SDK_VERSION = "0.0.3";
    private static final String TAG = "CFPaymentGatewayPlugin";
    private static final String THEME = "theme";
    private static final String SESSION = "session";
    private static final String SESSION_REQUIRED = "Session object is required";
    private PluginCall currentPaymentCall;

    /**
     * Initiates a web checkout payment.
     * This method expects a session object and an optional theme object.
     * The session object should contain the environment, order ID, and payment session ID.
     * The theme object can contain optional UI customization options.
     *
     * @param call : {@link PluginCall} containing session and theme details
     */
    @PluginMethod
    public void doWebCheckoutPayment(PluginCall call) {
        currentPaymentCall = call;
        try {
            JSObject sessionObj = call.getObject(SESSION);
            JSObject themeObj = call.getObject(THEME);
            if (sessionObj == null) {
                call.reject(SESSION_REQUIRED);
                return;
            }

            JSONObject sessionOptions = new JSONObject(sessionObj.toString());
            JSONObject themeOptions = themeObj != null ? new JSONObject(themeObj.toString()) : null;

            CFSession cfSession = buildCFSession(sessionOptions);
            CFWebCheckoutTheme cfWebTheme = buildCFWebTheme(themeOptions);

            CFWebCheckoutPayment cfWebCheckoutPayment = new CFWebCheckoutPayment.CFWebCheckoutPaymentBuilder()
                .setSession(cfSession)
                .setCFWebCheckoutUITheme(cfWebTheme)
                .build();

            CFPayment.CFSDKFramework.CAPACITOR.withVersion(CF_CAP_SDK_VERSION);
            cfWebCheckoutPayment.setCfsdkFramework(CFPayment.CFSDKFramework.CAPACITOR);
            cfWebCheckoutPayment.setCfSDKFlavour(CFPayment.CFSDKFlavour.WEB_CHECKOUT);

            if (getActivity() != null) {
                CFPaymentGatewayService gatewayService = CFPaymentGatewayService.getInstance();
                gatewayService.setCheckoutCallback(this);
                gatewayService.doPayment(getActivity(), cfWebCheckoutPayment);
            }
        } catch (Exception e) {
            call.reject(TAG + " Web payment failed: " + e.getMessage());
            currentPaymentCall = null;
        }
    }

    /**
     * Initiates a subscription payment.
     * This method expects a session object and an optional theme object.
     * The session object should contain the environment, subscription ID, and subscription session_id
     * The theme object can contain optional UI customization options.
     * This method is specifically for subscription payments and uses the Cashfree Subscription API.
     *
     * @param call : {@link PluginCall} containing session and theme details
     */
    @PluginMethod
    public void doSubscriptionPayment(PluginCall call) {
        currentPaymentCall = call;
        try {
            JSObject sessionObj = call.getObject(SESSION);
            JSObject themeObj = call.getObject(THEME);
            if (sessionObj == null) {
                call.reject(SESSION_REQUIRED);
                return;
            }

            JSONObject sessionOptions = new JSONObject(sessionObj.toString());
            JSONObject themeOptions = themeObj != null ? new JSONObject(themeObj.toString()) : null;

            CFSubscriptionSession cfSession = buildCFSubscriptionSession(sessionOptions);
            CFWebCheckoutTheme cfWebTheme = buildCFWebTheme(themeOptions);

            CFSubscriptionPayment cfSubscriptionPayment = new CFSubscriptionPayment.CFSubscriptionCheckoutBuilder()
                .setSubscriptionSession(cfSession)
                .setSubscriptionUITheme(cfWebTheme)
                .build();

            CFPayment.CFSDKFramework.CAPACITOR.withVersion(CF_CAP_SDK_VERSION);
            cfSubscriptionPayment.setCfsdkFramework(CFPayment.CFSDKFramework.CAPACITOR);
            cfSubscriptionPayment.setCfSDKFlavour(CFPayment.CFSDKFlavour.SUBSCRIPTION);

            if (getActivity() != null) {
                CFPaymentGatewayService gatewayService = CFPaymentGatewayService.getInstance();
                gatewayService.setSubscriptionCheckoutCallback(this);
                gatewayService.doSubscriptionPayment(getActivity(), cfSubscriptionPayment);
            }
        } catch (Exception e) {
            call.reject(TAG + " Subscription payment failed: " + e.getMessage());
            currentPaymentCall = null;
        }
    }

    /**
     * Initiates a UPI payment using the Cashfree UPI Intent API.
     * This method expects a session object and an optional theme object.
     * The session object should contain the environment, order ID, and payment session ID.
     * The theme object can contain optional UI customization options.
     * This method is specifically for UPI payments and uses the Cashfree UPI Intent API.
     * It allows users to make payments using UPI apps installed on their devices.
     *
     * @param call : {@link PluginCall} containing session and theme details
     */
    @PluginMethod
    public void doUPIPayment(PluginCall call) {
        currentPaymentCall = call;
        try {
            JSObject sessionObj = call.getObject(SESSION);
            JSObject themeObj = call.getObject(THEME);

            if (sessionObj == null) {
                call.reject(SESSION_REQUIRED);
                return;
            }

            JSONObject sessionOptions = new JSONObject(sessionObj.toString());
            JSONObject themeOptions = themeObj != null ? new JSONObject(themeObj.toString()) : null;

            CFSession cfSession = buildCFSession(sessionOptions);
            CFIntentTheme cfTheme = buildCFUPITheme(themeOptions);

            CFUPIIntentCheckoutPayment cfUpiIntentCheckoutPayment = new CFUPIIntentCheckoutPayment.CFUPIIntentPaymentBuilder()
                .setSession(cfSession)
                .setCfIntentTheme(cfTheme)
                .build();

            CFPayment.CFSDKFramework.CAPACITOR.withVersion(CF_CAP_SDK_VERSION);
            cfUpiIntentCheckoutPayment.setCfsdkFramework(CFPayment.CFSDKFramework.CAPACITOR);
            cfUpiIntentCheckoutPayment.setCfSDKFlavour(CFPayment.CFSDKFlavour.INTENT);

            if (getActivity() != null) {
                CFPaymentGatewayService gatewayService = CFPaymentGatewayService.getInstance();
                gatewayService.setCheckoutCallback(this);
                gatewayService.doPayment(getActivity(), cfUpiIntentCheckoutPayment);
            }
        } catch (Exception e) {
            call.reject("UPI payment failed: " + e.getMessage());
            currentPaymentCall = null;
        }
    }

    @Override
    public void onPaymentVerify(String orderID) {
        Logger.info(TAG, "Payment verification for order: " + orderID);
        triggerCallback(orderID, null);
    }

    @Override
    public void onPaymentFailure(CFErrorResponse cfErrorResponse, String orderID) {
        Logger.info(TAG, "Payment failed for order: " + orderID + " Error: " + cfErrorResponse.getMessage());
        triggerCallback(orderID, cfErrorResponse.toJSON().toString());
    }

    @Override
    public void onSubscriptionVerify(CFSubscriptionResponse cfSubscriptionResponse) {
        Logger.info(TAG, "Subscription verification for order: " + cfSubscriptionResponse.getSubscriptionId());
        triggerCallback(cfSubscriptionResponse.getSubscriptionId(), null);
    }

    @Override
    public void onSubscriptionFailure(CFErrorResponse cfErrorResponse) {
        Logger.info(TAG, "Subscription failed for order with Error: " + cfErrorResponse.getMessage());
        triggerCallback(null, cfErrorResponse.toJSON().toString());
    }

    /**
     * Builds a CFSession object from the provided session JSON object.
     *
     * @param sessionObject : {@link JSONObject} containing session details
     * @return : CFSession
     * @throws IllegalStateException if the session is invalid
     */
    private CFSession buildCFSession(JSONObject sessionObject) {
        CFSession cfSession;
        try {
            cfSession = new CFSession.CFSessionBuilder()
                .setEnvironment(CFSession.Environment.valueOf(sessionObject.getString("environment")))
                .setOrderId(sessionObject.getString("orderID"))
                .setPaymentSessionID(sessionObject.getString("payment_session_id"))
                .build();
        } catch (Exception exception) {
            throw new IllegalStateException("CFSession is invalid");
        }
        return cfSession;
    }

    /**
     * Builds a CFSubscriptionSession object from the provided session JSON object.
     *
     * @param sessionObject : {@link JSONObject} containing session details
     * @return : CFSubscriptionSession
     * @throws IllegalStateException if the session is invalid
     */
    private CFSubscriptionSession buildCFSubscriptionSession(JSONObject sessionObject) {
        CFSubscriptionSession cfSubscriptionSession;
        try {
            cfSubscriptionSession = new CFSubscriptionSession.CFSubscriptionSessionBuilder()
                .setEnvironment(CFSubscriptionSession.Environment.valueOf(sessionObject.getString("environment")))
                .setSubscriptionId(sessionObject.getString("subscription_id"))
                .setSubscriptionSessionID(sessionObject.getString("subscription_session_id"))
                .build();
        } catch (Exception exception) {
            throw new IllegalStateException("Subscription Session is invalid");
        }
        return cfSubscriptionSession;
    }

    /**
     * Builds a CFWebCheckoutTheme object from the provided theme JSON object.
     *
     * @param themeOptions : {@link JSONObject} containing theme options
     * @return : {@link  CFWebCheckoutTheme}
     * @throws CFInvalidArgumentException if the theme options are invalid
     */
    private CFWebCheckoutTheme buildCFWebTheme(JSONObject themeOptions) throws CFInvalidArgumentException {
        if (themeOptions == null) {
            themeOptions = new JSONObject();
        }
        return new CFWebCheckoutTheme.CFWebCheckoutThemeBuilder()
            .setNavigationBarBackgroundColor(themeOptions.optString("navigationBarBackgroundColor", "#6A3FD3"))
            .setNavigationBarTextColor(themeOptions.optString("navigationBarTextColor", "#FFFFFF"))
            .build();
    }

    /**
     * @param themeOptions : {@link JSONObject} containing theme options
     * @return : {@link  CFIntentTheme}
     * @throws CFInvalidArgumentException if the theme options are invalid
     */
    private CFIntentTheme buildCFUPITheme(JSONObject themeOptions) throws CFInvalidArgumentException {
        if (themeOptions == null) {
            themeOptions = new JSONObject();
        }
        return new CFIntentTheme.CFIntentThemeBuilder()
            .setPrimaryTextColor(themeOptions.optString("primaryTextColor", "#11385b"))
            .setBackgroundColor(themeOptions.optString("backgroundColor", "#FFFFFF"))
            .build();
    }

    /**
     * Triggers the callback with the order ID and error message.
     *
     * @param orderID : The order ID of the payment or subscription
     * @param error:  The error message if any
     */
    private void triggerCallback(String orderID, String error) {
        JSObject result = new JSObject();
        if (orderID != null && !orderID.isEmpty()) {
            result.put("orderID", orderID);
        }
        if (error != null && !error.isEmpty()) {
            result.put("error", error);
        }
        if (currentPaymentCall != null) {
            currentPaymentCall.resolve(result);
            currentPaymentCall = null;
        }
    }
}
