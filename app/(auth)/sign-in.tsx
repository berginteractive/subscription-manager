import { useSignIn } from '@clerk/expo'
import { type Href, Link, useRouter } from 'expo-router'
import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'
import { styled } from 'nativewind'
import clsx from 'clsx'

const SafeAreaView = styled(RNSafeAreaView)

const PLACEHOLDER_COLOR = 'rgba(0,0,0,0.3)'

function BrandBlock() {
  return (
    <View className="auth-brand-block">
      <View className="auth-logo-wrap">
        <View className="auth-logo-mark">
          <Text className="auth-logo-mark-text">S</Text>
        </View>
        <View>
          <Text className="auth-wordmark">SubTrack</Text>
          <Text className="auth-wordmark-sub">SUBSCRIPTION MANAGER</Text>
        </View>
      </View>
    </View>
  )
}

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const isLoading = fetchStatus === 'fetching'

  const handleNavigate = ({ session, decorateUrl }: { session: { currentTask?: unknown } | null; decorateUrl: (url: string) => string }) => {
    if (session?.currentTask) return
    router.replace(decorateUrl('/') as Href)
  }

  const handleSignIn = async () => {
    const { error } = await signIn.password({ emailAddress: email.trim(), password })
    if (error) return

    if (signIn.status === 'complete') {
      await signIn.finalize({ navigate: handleNavigate })
    } else if (signIn.status === 'needs_client_trust') {
      await signIn.mfa.sendEmailCode()
    }
  }

  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code })
    if (signIn.status === 'complete') {
      await signIn.finalize({ navigate: handleNavigate })
    }
  }

  if (signIn.status === 'needs_client_trust') {
    return (
      <SafeAreaView className="auth-safe-area" edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView
            className="auth-scroll"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="auth-content">
              <BrandBlock />

              <View className="auth-brand-block">
                <Text className="auth-title text-center">Verify it's you</Text>
                <Text className="auth-subtitle">
                  We sent a 6-digit code to your email. Enter it below to continue.
                </Text>
              </View>

              <View className="auth-card">
                <View className="auth-form">
                  <View className="auth-field">
                    <Text className="auth-label">Verification code</Text>
                    <TextInput
                      className={clsx('auth-input', errors?.fields?.code && 'auth-input-error')}
                      value={code}
                      onChangeText={setCode}
                      placeholder="6-digit code"
                      placeholderTextColor={PLACEHOLDER_COLOR}
                      keyboardType="numeric"
                      autoComplete="one-time-code"
                      textContentType="oneTimeCode"
                      maxLength={6}
                    />
                    {errors?.fields?.code && (
                      <Text className="auth-error">{errors.fields.code.message}</Text>
                    )}
                  </View>

                  <Pressable
                    className={clsx('auth-button', (isLoading || !code) && 'auth-button-disabled')}
                    onPress={handleVerify}
                    disabled={isLoading || !code}
                  >
                    <Text className="auth-button-text">
                      {isLoading ? 'Verifying…' : 'Verify'}
                    </Text>
                  </Pressable>

                  <Pressable
                    className="auth-secondary-button"
                    onPress={() => signIn.mfa.sendEmailCode()}
                    disabled={isLoading}
                  >
                    <Text className="auth-secondary-button-text">Resend code</Text>
                  </Pressable>

                  <Pressable
                    className="auth-secondary-button"
                    onPress={() => signIn.reset()}
                  >
                    <Text className="auth-secondary-button-text">Start over</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="auth-safe-area" edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          className="auth-scroll"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="auth-content">
            <BrandBlock />

            <View className="auth-brand-block">
              <Text className="auth-title text-center">Welcome back</Text>
              <Text className="auth-subtitle">
                Sign in to continue managing your subscriptions
              </Text>
            </View>

            <View className="auth-card">
              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">Email</Text>
                  <TextInput
                    className={clsx('auth-input', errors?.fields?.identifier && 'auth-input-error')}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor={PLACEHOLDER_COLOR}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    returnKeyType="next"
                  />
                  {errors?.fields?.identifier && (
                    <Text className="auth-error">{errors.fields.identifier.message}</Text>
                  )}
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <View style={{ position: 'relative' }}>
                    <TextInput
                      className={clsx('auth-input', errors?.fields?.password && 'auth-input-error')}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter your password"
                      placeholderTextColor={PLACEHOLDER_COLOR}
                      secureTextEntry={!showPassword}
                      autoComplete="current-password"
                      textContentType="password"
                      returnKeyType="done"
                      onSubmitEditing={handleSignIn}
                      style={{ paddingRight: 56 }}
                    />
                    <Pressable
                      onPress={() => setShowPassword((v) => !v)}
                      style={{
                        position: 'absolute',
                        right: 16,
                        top: 0,
                        bottom: 0,
                        justifyContent: 'center',
                      }}
                      hitSlop={8}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: 'sans-semibold',
                          color: 'rgba(0,0,0,0.4)',
                        }}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </Text>
                    </Pressable>
                  </View>
                  {errors?.fields?.password && (
                    <Text className="auth-error">{errors.fields.password.message}</Text>
                  )}
                </View>

                <Pressable
                  className={clsx(
                    'auth-button',
                    (!email.trim() || !password || isLoading) && 'auth-button-disabled',
                  )}
                  onPress={handleSignIn}
                  disabled={!email.trim() || !password || isLoading}
                >
                  <Text className="auth-button-text">
                    {isLoading ? 'Signing in…' : 'Sign in'}
                  </Text>
                </Pressable>
              </View>
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">New to SubTrack?</Text>
              <Link href="/(auth)/sign-up" asChild>
                <Pressable>
                  <Text className="auth-link">Create an account</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
