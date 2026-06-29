import { useState } from 'react'
import { View, Text, TextInput, FlatList } from 'react-native'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'
import { styled } from 'nativewind'
import SubscriptionCard from '@/components/SubscriptionCard'
import { HOME_SUBSCRIPTIONS } from '@/constants/data'

const SafeAreaView = styled(RNSafeAreaView)

const PLACEHOLDER_COLOR = 'rgba(0,0,0,0.3)'

const Subscriptions = () => {
    const [query, setQuery] = useState('')
    const [expandedId, setExpandedId] = useState<string | null>(null)

    const term = query.trim().toLowerCase()
    const filtered = term
        ? HOME_SUBSCRIPTIONS.filter(s =>
              s.name.toLowerCase().includes(term) ||
              s.plan?.toLowerCase().includes(term) ||
              s.category?.toLowerCase().includes(term),
          )
        : HOME_SUBSCRIPTIONS

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
            <View className="subs-header">
                <Text className="subs-title">My Subscriptions</Text>
                <View className="subs-search-wrap">
                    <TextInput
                        className="subs-search-input"
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search subscriptions…"
                        placeholderTextColor={PLACEHOLDER_COLOR}
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                        returnKeyType="search"
                    />
                </View>
            </View>

            <FlatList
                data={filtered}
                keyExtractor={item => item.id}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 12 }}
                renderItem={({ item }) => (
                    <SubscriptionCard
                        {...item}
                        expanded={expandedId === item.id}
                        onPress={() =>
                            setExpandedId(prev => (prev === item.id ? null : item.id))
                        }
                    />
                )}
                ListEmptyComponent={
                    <Text className="subs-empty">No subscriptions found</Text>
                }
            />
        </SafeAreaView>
    )
}

export default Subscriptions
