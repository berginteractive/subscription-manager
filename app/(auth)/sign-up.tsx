import { useAuth, useSignUp } from '@clerk/expo'
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

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp()
  const { isSignedIn } = useAuth()
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

  const handleSignUp = async () => {
    const { error } = await signUp.password({ emailAddress: email.trim(), password })
    if (error) return
    await signUp.verifications.sendEmailCode()
  }

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code })
    if (signUp.status === 'complete') {
      await signUp.finalize({ navigate: handleNavigate })
    }
  }

  if (signUp.status === 'complete' || isSignedIn) return null

  const isVerificationStep =
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0

  if (isVerificationStep) {
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
                <Text className="auth-title text-center">Check your email</Text>
                <Text className="auth-subtitle">
                  We sent a 6-digit code to{'\n'}
                  <Text style={{ fontFamily: 'sans-semibold' }}>{email}</Text>
                  {'\n'}Enter it below to verify your account.
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
                      returnKeyType="done"
                      onSubmitEditing={handleVerify}
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
                      {isLoading ? 'Verifying…' : 'Verify email'}
                    </Text>
                  </Pressable>

                  <Pressable
                    className="auth-secondary-button"
                    onPress={() => signUp.verifications.sendEmailCode()}
                    disabled={isLoading}
                  >
                    <Text className="auth-secondary-button-text">Resend code</Text>
                  </Pressable>
                </View>
              </View>

              <View className="auth-link-row">
                <Text className="auth-link-copy">Wrong email?</Text>
                <Pressable onPress={() => signUp.reset?.()}>
                  <Text className="auth-link">Start over</Text>
                </Pressable>
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
              <Text className="auth-title text-center">Create an account</Text>
              <Text className="auth-subtitle">
                Start tracking your subscriptions in one place
              </Text>
            </View>

            <View className="auth-card">
              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">Email</Text>
                  <TextInput
                    className={clsx('auth-input', errors?.fields?.emailAddress && 'auth-input-error')}
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
                  {errors?.fields?.emailAddress && (
                    <Text className="auth-error">{errors.fields.emailAddress.message}</Text>
                  )}
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <View style={{ position: 'relative' }}>
                    <TextInput
                      className={clsx('auth-input', errors?.fields?.password && 'auth-input-error')}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Create a password"
                      placeholderTextColor={PLACEHOLDER_COLOR}
                      secureTextEntry={!showPassword}
                      autoComplete="new-password"
                      textContentType="newPassword"
                      returnKeyType="done"
                      onSubmitEditing={handleSignUp}
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
                  <Text className="auth-helper">Must be at least 8 characters</Text>
                </View>

                <Pressable
                  className={clsx(
                    'auth-button',
                    (!email.trim() || !password || isLoading) && 'auth-button-disabled',
                  )}
                  onPress={handleSignUp}
                  disabled={!email.trim() || !password || isLoading}
                >
                  <Text className="auth-button-text">
                    {isLoading ? 'Creating account…' : 'Create account'}
                  </Text>
                </Pressable>
              </View>
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">Already have an account?</Text>
              <Link href="/(auth)/sign-in" asChild>
                <Pressable>
                  <Text className="auth-link">Sign in</Text>
                </Pressable>
              </Link>
            </View>

            {/* Required by Clerk for bot protection */}
            <View nativeID="clerk-captcha" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
