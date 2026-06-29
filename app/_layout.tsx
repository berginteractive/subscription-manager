import { ClerkProvider } from '@clerk/expo'
import { tokenCache } from '@clerk/expo/token-cache'
import { SplashScreen, Stack, usePathname } from 'expo-router'
import '@/global.css'
import { useFonts } from 'expo-font'
import { useEffect, useRef } from 'react'
import { PostHogProvider } from 'posthog-react-native'
import { posthog } from '../src/config/posthog'

SplashScreen.preventAutoHideAsync()

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file')
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf'),
  })

  const pathname = usePathname()
  const previousPathname = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync()
  }, [fontsLoaded, fontError])

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      posthog.screen(pathname, {
        previous_screen: previousPathname.current ?? null,
      })
      previousPathname.current = pathname
    }
  }, [pathname])

  if (!fontsLoaded && !fontError) return null
  if (fontError) throw fontError

  return (
    <PostHogProvider
      client={posthog}
      autocapture={{
        captureScreens: false,
        captureTouches: true,
        propsToCapture: ['testID'],
        maxElementsCaptured: 20,
      }}
    >
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <Stack screenOptions={{ headerShown: false }} />
      </ClerkProvider>
    </PostHogProvider>
  )
}
