import {View, Text} from 'react-native'
import {Link, useLocalSearchParams} from "expo-router";
import { usePostHog } from 'posthog-react-native'
import { useEffect } from 'react'

const SubscriptionDetails = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const posthog = usePostHog()

    useEffect(() => {
        posthog.capture('subscription_details_viewed', { subscription_id: id })
    }, [id, posthog])

    return (
        <View>
            <Text>SubscriptionDetails: {id}</Text>
            <Link href="/">Go back</Link>
        </View>
    )
}
    export default SubscriptionDetails
