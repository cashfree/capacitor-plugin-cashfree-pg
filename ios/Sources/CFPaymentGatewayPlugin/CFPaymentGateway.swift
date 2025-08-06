import Foundation

@objc public class CFPaymentGateway: NSObject {
    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }
}
