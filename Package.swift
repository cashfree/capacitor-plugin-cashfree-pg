// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapacitorPluginCashfreePg",
    platforms: [.iOS(.v14)],
    products: [
        .library(
            name: "CapacitorPluginCashfreePg",
            targets: ["CFPaymentGatewayPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "7.0.0")
    ],
    targets: [
        .target(
            name: "CFPaymentGatewayPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/CFPaymentGatewayPlugin"),
        .testTarget(
            name: "CFPaymentGatewayPluginTests",
            dependencies: ["CFPaymentGatewayPlugin"],
            path: "ios/Tests/CFPaymentGatewayPluginTests")
    ]
)