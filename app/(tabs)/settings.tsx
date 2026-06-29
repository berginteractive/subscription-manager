import { useClerk, useUser } from '@clerk/expo'
import { View, Text, Pressable, Image } from 'react-native'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'
import { styled } from 'nativewind'
import images from '@/constants/images'
import dayjs from 'dayjs'
import { usePostHog } from 'posthog-react-native'
import { useEffect } from 'react'

const SafeAreaView = styled(RNSafeAreaView)

const Settings = () => {
    const { user } = useUser()
    const { signOut } = useClerk()
    const posthog = usePostHog()

    const email = user?.primaryEmailAddress?.emailAddress ?? ''
    const userId = user?.id ?? ''
    const joinedDate = user?.createdAt ? dayjs(user.createdAt).format('DD. MM. YYYY.') : '—'
    const truncatedId = userId.length > 20 ? userId.slice(0, 20) + '…' : userId

    useEffect(() => {
        if (userId) {
            posthog.identify(userId, {
                $set: { email },
            })
        }
    }, [userId, email, posthog])

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Text className="text-3xl font-sans-bold text-primary mb-6">Settings</Text>

            {/* Profile card */}
            <View className="rounded-3xl border border-border bg-card p-5 mb-4">
                <View className="flex-row items-center gap-4">
                    <Image
                        source={images.avatar}
                        className="size-14 rounded-2xl"
                    />
                    <View className="flex-1 min-w-0">
                        <Text className="text-base font-sans-bold text-primary" numberOfLines={1}>
                            {user?.firstName ?? user?.username ?? 'Account'}
                        </Text>
                        <Text className="text-sm font-sans-medium text-muted-foreground" numberOfLines={1}>
                            {email}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Account details card */}
            <View className="rounded-3xl border border-border bg-card px-5 py-4 mb-6">
                <Text className="text-base font-sans-bold text-primary mb-3">Account</Text>

                <View className="flex-row items-center justify-between py-3 border-b border-border">
                    <Text className="text-sm font-sans-medium text-muted-foreground">Account ID</Text>
                    <Text className="text-sm font-sans-semibold text-primary">{truncatedId}</Text>
                </View>

                <View className="flex-row items-center justify-between pt-3">
                    <Text className="text-sm font-sans-medium text-muted-foreground">Joined</Text>
                    <Text className="text-sm font-sans-semibold text-primary">{joinedDate}</Text>
                </View>
            </View>

            {/* Sign out */}
            <Pressable
                className="items-center rounded-2xl bg-accent py-4"
                onPress={async () => {
                    try {
                        await signOut()
                        posthog.capture('user_signed_out')
                        posthog.reset()
                    } catch {
                        // sign-out failed; identity preserved
                    }
                }}
            >
                <Text className="text-base font-sans-bold text-white">Sign Out</Text>
            </Pressable>
        </SafeAreaView>
    )
}

export default Settings
