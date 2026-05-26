# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Capacitor 7 plugin that wraps the Cashfree Payment Gateway SDK for Android and iOS. It exposes three payment methods to TypeScript consumers: Web Checkout, UPI Intent, and Subscription Checkout. The web implementation is a stub that always throws — this plugin is mobile-only.

## Build commands

```bash
# Full plugin build (clean → docgen → tsc → rollup)
npm run build

# Watch TypeScript (no rollup bundling)
npm run watch

# Lint TypeScript + Java (Prettier) + Swift (SwiftLint)
npm run lint

# Auto-fix lint issues
npm run fmt

# Regenerate README API docs from JSDoc + produce dist/docs.json
npm run docgen

# Verify all platforms
npm run verify

# Android only (runs Gradle clean build test)
npm run verify:android

# iOS only (runs pod lib lint — requires CocoaPods)
npm run verify:ios
```

## Testing on device

```bash
# After npm run build, sync and run on Android
npx cap sync android && npx cap run android

# After npm run build, sync and run on iOS
npx cap sync ios && npx cap run ios
```

## Architecture

```
src/                         TypeScript layer (compiled to dist/)
  definitions.ts             CFPaymentGatewayPlugin interface + CFPaymentResult type
  index.ts                   registerPlugin call — registers as "CFPaymentGateway"
  web.ts                     Stub WebPlugin — throws on all methods (mobile-only)

android/src/main/java/.../   Java native layer
  CFPaymentGatewayPlugin.java  @CapacitorPlugin wrapping Cashfree Android SDK 2.4.0
                               Implements CFCheckoutResponseCallback + CFSubscriptionResponseCallback

ios/Sources/CFPaymentGatewayPlugin/
  CFPaymentGatewayPlugin.swift  Swift native layer wrapping Cashfree iOS SDK 2.4.0
                                Implements CFResponseDelegate
```

The plugin is registered under the name `"CFPaymentGateway"`. The Capacitor bridge maps JS calls → native methods by matching this name.

## Payment flow contract

All three methods accept a `CheckoutPayment` object from `cashfree-pg-api-contract` (the official API contract package). The object is passed to native as-is via Capacitor's plugin call mechanism. Native code extracts a `session` sub-object and an optional `theme` sub-object.

**Session fields for Web/UPI:**
- `environment`: `"SANDBOX"` | `"PRODUCTION"`
- `orderID`: string
- `payment_session_id`: string

**Session fields for Subscription:**
- `environment`: `"SANDBOX"` | `"PRODUCTION"`
- `subscription_id`: string
- `subscription_session_id`: string

**Result shape (`CFPaymentResult`):**
- `orderID`: string — present on success (or failure with a known order)
- `error`: string (JSON-encoded `CFErrorResponse`) — present on failure

Both fields can appear simultaneously. Check for `error` to determine payment outcome.

## SDK versions

| Platform | SDK | Version |
|----------|-----|---------|
| Android | `com.cashfree.pg:api` | 2.4.0 |
| iOS | `CashfreePG` (CocoaPods) | ~> 2.4.0 |
| Plugin | capacitor-plugin-cashfree-pg | 0.1.0 |

The platform string embedded in payment objects follows the pattern `icap-{type}-{version}-xx-m-s-x-{platform}-{osVersion}`. Type tokens: `c` (web checkout), `i` (UPI intent), `s` (subscription). Note: subscription was previously `sbc` — changed to `s` in 0.1.0.

## Key constraints

- `minSdkVersion` Android: 23. iOS deployment target: 14.0.
- Capacitor peer dependency: `>=7.0.0`.
- TypeScript is pinned to `~4.1.5` — don't upgrade without checking Capacitor compatibility.
- `npm run docgen` regenerates `README.md` from JSDoc comments in `definitions.ts`. Always run `npm run build` (which includes docgen) before publishing — `prepublishOnly` enforces this.
- The `dist/` directory is committed and published; it is not gitignored.
