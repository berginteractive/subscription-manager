# PostHog Setup — Bare React Native

Use this guide when integrating PostHog into a **bare React Native** project (no Expo managed workflow).

## Environment variables

Use `react-native-config` to load `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from a `.env` file. Variables are embedded at build time, not runtime.

```dotenv
POSTHOG_PROJECT_TOKEN=phc_xxx
POSTHOG_HOST=https://eu.i.posthog.com
```

```ts
import Config from 'react-native-config';

const client = new PostHog(Config.POSTHOG_PROJECT_TOKEN, {
  host: Config.POSTHOG_HOST,
});
```

## Provider placement

Place `PostHogProvider` **inside** `NavigationContainer` for React Navigation v7 compatibility.

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { PostHogProvider } from 'posthog-react-native';

export default function App() {
  return (
    <NavigationContainer>
      <PostHogProvider client={client}>
        {/* your app */}
      </PostHogProvider>
    </NavigationContainer>
  );
}
```

## Dependencies

`react-native-svg` is a required peer dependency of `posthog-react-native` (used by the surveys feature) and must be installed alongside it.
