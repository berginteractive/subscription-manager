<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the SubTrack subscription manager Expo app. PostHog is now installed, configured, and instrumented across all key user flows.

**Changes made:**

- Created `app.config.js` (converting `app.json` to a dynamic config) to expose PostHog token and host as Expo extras via `Constants.expoConfig?.extra`.
- Created `src/config/posthog.ts` — the PostHog client singleton, reading configuration from `expo-constants`, with production-safe defaults (disabled if token is not configured, debug mode in `__DEV__`).
- Updated `app/_layout.tsx` — wrapped the app in `PostHogProvider` (with autocapture for touches, manual screen tracking disabled to support Expo Router), and added a `useEffect` that manually calls `posthog.screen()` on every pathname change.
- Added `posthog.identify()` + `posthog.capture('user_signed_in')` in `app/(auth)/sign-in.tsx` on successful sign-in.
- Added `posthog.identify()` + `posthog.capture('user_signed_up')` in `app/(auth)/sign-up.tsx` on email verification complete.
- Added `posthog.identify()` on mount, `posthog.capture('user_signed_out')` + `posthog.reset()` on sign-out in `app/(tabs)/settings.tsx`.
- Added `posthog.capture('subscription_card_expanded')` in `app/(tabs)/index.tsx` when a card is expanded.
- Added `posthog.capture('subscription_details_viewed')` on mount in `app/subscriptions/[id].tsx`.
- Added `posthog.capture('onboarding_viewed')` on mount in `app/onboarding.tsx`.
- Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in `.env`.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | Captured when a user successfully completes the sign-in flow. | `app/(auth)/sign-in.tsx` |
| `user_signed_up` | Captured when a new user completes email verification and finishes registration. | `app/(auth)/sign-up.tsx` |
| `user_signed_out` | Captured when a user taps the Sign Out button in Settings. | `app/(tabs)/settings.tsx` |
| `subscription_card_expanded` | Captured when a user expands a subscription card on the home screen. | `app/(tabs)/index.tsx` |
| `subscription_details_viewed` | Captured when a user navigates to the subscription detail page. | `app/subscriptions/[id].tsx` |
| `onboarding_viewed` | Captured when a user views the onboarding screen (top of activation funnel). | `app/onboarding.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://eu.posthog.com/project/211491/dashboard/779035)
- [New sign-ups over time](https://eu.posthog.com/project/211491/insights/ijNdPmaw)
- [Daily sign-ins](https://eu.posthog.com/project/211491/insights/tG39oa5M)
- [Sign-up → Sign-in activation funnel](https://eu.posthog.com/project/211491/insights/mPi3ET8Z)
- [Sign-outs (churn signal)](https://eu.posthog.com/project/211491/insights/hDOS8Wgz)
- [Subscription card expansions](https://eu.posthog.com/project/211491/insights/LlDJ1f4g)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. (Currently, `settings.tsx` re-identifies on mount, which covers returning users.)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
