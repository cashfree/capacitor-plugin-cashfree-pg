import Capacitor
import CashfreePGCoreSDK
import CashfreePGUISDK
import CashfreePG
import Foundation

/// Please read the Capacitor iOS Plugin Development Guide
/// here: https://capacitorjs.com/docs/plugins/ios
@objc(CFPaymentGatewayPlugin)
public class CFPaymentGatewayPlugin: CAPPlugin, CAPBridgedPlugin, CFResponseDelegate {

    public let identifier = "CFPaymentGatewayPlugin"
    public let jsName = "CFPaymentGateway"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "doWebCheckoutPayment", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "doUPIPayment", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "doSubscriptionPayment", returnType: CAPPluginReturnPromise)
    ]
    private var environment: CFENVIRONMENT = .SANDBOX
    private let versionNumber = "0.0.3"
    private var currentPaymentCall: CAPPluginCall?

    @objc func doWebCheckoutPayment(_ call: CAPPluginCall) {
        currentPaymentCall = call
        guard let sessionObj = call.getObject("session") else {
            call.reject("Session object is required")
            return
        }

        do {
            let cfSession = try! buildCFSession(from: sessionObj)
            if cfSession != nil {
                let cfWebCheckoutPayment = try CFWebCheckoutPayment.CFWebCheckoutPaymentBuilder()
                    .setSession(cfSession!)
                    .build()

                let systemVersion = UIDevice.current.systemVersion
                cfWebCheckoutPayment.setPlatform("icap-c-\(versionNumber)-xx-m-s-x-i-\(systemVersion.prefix(4))")
                let cfPaymentGateway = CFPaymentGatewayService.getInstance()

                if let viewController = self.bridge?.viewController {
                    cfPaymentGateway.setCallback(self)
                    try cfPaymentGateway.doPayment(cfWebCheckoutPayment, viewController: viewController)
                } else {
                    call.reject("Unable to access view controller")
                }
            }
        } catch let error {
            print("Web checkout payment failed: \(error.localizedDescription)")
            call.reject("Payment failed: \(error.localizedDescription)")
        }
    }

    @objc func doSubscriptionPayment(_ call: CAPPluginCall) {
        currentPaymentCall = call
        guard let sessionObj = call.getObject("session") else {
            call.reject("Session object is required")
            return
        }

        do {
            let cfSession = try! buildCFSubscriptionSession(from: sessionObj)
            if cfSession != nil {
                let subscriptionCheckoutPayment = try CFSubscriptionPayment.CFSubscriptionPaymentBuilder()
                    .setSession(cfSession!)
                    .build()

                let systemVersion = UIDevice.current.systemVersion
                subscriptionCheckoutPayment.setPlatform("icap-sbc-\(versionNumber)-xx-m-s-x-i-\(systemVersion.prefix(4))")
                let cfPaymentGateway = CFPaymentGatewayService.getInstance()

                if let viewController = self.bridge?.viewController {
                    cfPaymentGateway.setCallback(self)
                    try cfPaymentGateway.startSubscription(subscriptionCheckoutPayment, viewController: viewController)
                } else {
                    call.reject("Unable to access view controller")
                }
            }
        } catch let error {
            print("Subscription checkout payment failed: \(error.localizedDescription)")
            call.reject("Subscription Payment failed: \(error.localizedDescription)")
        }
    }

    @objc func doUPIPayment(_ call: CAPPluginCall) {
        currentPaymentCall = call
        guard let sessionObj = call.getObject("session") else {
            call.reject("Session object is required")
            return
        }

        do {
            let cfSession = try! buildCFSession(from: sessionObj)
            if cfSession != nil {

                let paymentComponents = try CFPaymentComponent.CFPaymentComponentBuilder()
                    .enableComponents(["upi"])
                    .build()

                let theme = try getTheme(from: call.getObject("theme") ?? [:])

                let cfUpiPayment = try CFDropCheckoutPayment.CFDropCheckoutPaymentBuilder()
                    .setSession(cfSession!)
                    .setTheme(theme!)
                    .setComponent(paymentComponents)
                    .build()

                let systemVersion = UIDevice.current.systemVersion
                cfUpiPayment.setPlatform("icap-i-\(versionNumber)-xx-m-s-x-i-\(systemVersion.prefix(4))")

                let cfPaymentGateway = CFPaymentGatewayService.getInstance()
                if let viewController = self.bridge?.viewController {
                    cfPaymentGateway.setCallback(self)
                    try cfPaymentGateway.doPayment(cfUpiPayment, viewController: viewController)
                } else {
                    call.reject("Unable to access view controller")
                }
            }
        } catch let error {
            print("UPI payment failed: \(error.localizedDescription)")
            call.reject("Payment failed: \(error.localizedDescription)")
        }
    }

    private func buildCFSession(from options: [String: Any]) throws -> CFSession? {
        let paymentSessionId = options["payment_session_id"] as? String
        let orderId = options["orderID"] as? String
        let envString = options["environment"] as? String ?? "SANDBOX"
        let sessionEnv: CFENVIRONMENT = envString == "PRODUCTION" ? .PRODUCTION : .SANDBOX

        do {
            let builder = CFSession.CFSessionBuilder()
                .setOrderID(orderId ?? "")
                .setPaymentSessionId(paymentSessionId ?? "")
                .setEnvironment(sessionEnv)
            let session = try builder.build()
            return session
        } catch let e {
            let error = e as! CashfreeError
            print(error.localizedDescription)
        }
        return nil
    }

    private func buildCFSubscriptionSession(from options: [String: Any]) throws -> CFSubscriptionSession? {
        let subscriptionSessionId = options["subscription_session_id"] as? String
        let subscriptionId = options["subscription_id"] as? String
        let envString = options["environment"] as? String ?? "SANDBOX"
        let sessionEnv: CFENVIRONMENT = envString == "PRODUCTION" ? .PRODUCTION : .SANDBOX

        do {
            let builder = CFSubscriptionSession.CFSubscriptionSessionBuilder()
                .setSubscriptionId(subscriptionId ?? "")
                .setSubscriptionSessionId(subscriptionSessionId ?? "")
                .setEnvironment(sessionEnv)
            let session = try builder.build()
            return session
        } catch let e {
            let error = e as! CashfreeError
            print(error.localizedDescription)
        }
        return nil
    }

    private func getTheme(from theme: [String: Any]) throws -> CFTheme? {
        do {
            return try CFTheme.CFThemeBuilder()
                .setNavigationBarBackgroundColor(theme["navigationBarBackgroundColor"] as? String ?? "")
                .setNavigationBarTextColor(theme["navigationBarTextColor"] as? String ?? "")
                .setButtonBackgroundColor(theme["buttonBackgroundColor"] as? String ?? "")
                .setButtonTextColor(theme["buttonTextColor"] as? String ?? "")
                .setPrimaryTextColor(theme["primaryTextColor"] as? String ?? "" )
                .setSecondaryTextColor(theme["secondaryTextColor"] as? String ?? "")
                .build()
        } catch let e {
            let error = e as! CashfreeError
            print(error.localizedDescription)
        }
        return nil
    }

    private func stringify(json: Any) -> String {
        let options: JSONSerialization.WritingOptions = []
        do {
            let data = try JSONSerialization.data(withJSONObject: json, options: options)
            if let string = String(data: data, encoding: String.Encoding.utf8) {
                return string
            }
        } catch {
            print(error)
        }

        return ""
    }

    public func onError(_ error: CashfreePGCoreSDK.CFErrorResponse, order_id: String) {
        let data: [String: Any] = ["status": error.status ?? "",
                                   "message": error.message ?? "",
                                   "code": error.code ?? "",
                                   "type": error.type ?? ""]
        triggerCallback(orderID: order_id, error: stringify(json: data))
    }

    public func verifyPayment(order_id: String) {
        triggerCallback(orderID: order_id, error: nil)
    }

    private func triggerCallback(orderID: String?, error: String?) {
        var result: [String: Any] = [:]

        if let orderID = orderID, !orderID.isEmpty {
            result["orderID"] = orderID
        }

        if let error = error, !error.isEmpty {
            result["error"] = error
        }

        if let currentPaymentCall = currentPaymentCall {
            currentPaymentCall.resolve(result)
            self.currentPaymentCall = nil
        }
    }
}
