import { useState } from 'react'
import {
    Modal,
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native'
import dayjs from 'dayjs'
import clsx from 'clsx'
import { icons } from '@/constants/icons'
import {posthog} from "@/src/config/posthog"

const CATEGORIES = [
    'Entertainment',
    'AI Tools',
    'Developer Tools',
    'Design',
    'Productivity',
    'Cloud',
    'Music',
    'Other',
] as const

const CATEGORY_COLORS: Record<string, string> = {
    Entertainment: '#e8def8',
    'AI Tools':    '#b8d4e3',
    'Developer Tools': '#d4e8d4',
    Design:        '#f5c542',
    Productivity:  '#f5e6d3',
    Cloud:         '#dce8f5',
    Music:         '#f0d4f0',
    Other:         '#e8e8e8',
}

const PLACEHOLDER_COLOR = 'rgba(0,0,0,0.3)'

interface Props {
    visible: boolean
    onClose: () => void
    onCreate: (subscription: Subscription) => void
}

export default function CreateSubscriptionModal({ visible, onClose, onCreate }: Props) {
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [frequency, setFrequency] = useState<'Monthly' | 'Yearly'>('Monthly')
    const [category, setCategory] = useState('')

    const trimmedPrice = price.trim()
    const parsedPrice = /^\d+(\.\d+)?$/.test(trimmedPrice) ? parseFloat(trimmedPrice) : NaN
    const isValid = name.trim().length > 0 && !isNaN(parsedPrice) && parsedPrice > 0

    const clearForm = () => {
        setName('')
        setPrice('')
        setFrequency('Monthly')
        setCategory('')
    }

    const handleClose = () => {
        clearForm()
        onClose()
    }

    const handleSubmit = () => {
        if (!isValid) return
        const now = dayjs()
        const renewalDate = frequency === 'Monthly'
            ? now.add(1, 'month').toISOString()
            : now.add(1, 'year').toISOString()

        onCreate({
            id: `custom-${Date.now()}`,
            icon: icons.wallet,
            name: name.trim(),
            price: parsedPrice,
            currency: 'USD',
            billing: frequency,
            category: category || undefined,
            status: 'active',
            startDate: now.toISOString(),
            renewalDate,
            color: CATEGORY_COLORS[category] ?? '#e8e8e8',
        })

        posthog.capture('subscription_created', {
            subscription_name: name.trim(),
            subscription_price: parsedPrice,
            subscription_frequency: frequency,
            subscription_category: category,
        })
        clearForm()
    }

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
            <KeyboardAvoidingView
                className="modal-overlay"
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Pressable className="flex-1" onPress={handleClose} />

                <View className="modal-container">
                    <View className="modal-header">
                        <Text className="modal-title">New Subscription</Text>
                        <Pressable className="modal-close" onPress={handleClose}>
                            <Text className="modal-close-text">✕</Text>
                        </Pressable>
                    </View>

                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View className="modal-body">
                            <View className="auth-field">
                                <Text className="auth-label">Name</Text>
                                <TextInput
                                    className="auth-input"
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="e.g. Netflix"
                                    placeholderTextColor={PLACEHOLDER_COLOR}
                                    returnKeyType="next"
                                />
                            </View>

                            <View className="auth-field">
                                <Text className="auth-label">Price</Text>
                                <TextInput
                                    className="auth-input"
                                    value={price}
                                    onChangeText={setPrice}
                                    placeholder="0.00"
                                    placeholderTextColor={PLACEHOLDER_COLOR}
                                    keyboardType="decimal-pad"
                                    returnKeyType="done"
                                />
                            </View>

                            <View className="auth-field">
                                <Text className="auth-label">Frequency</Text>
                                <View className="picker-row">
                                    {(['Monthly', 'Yearly'] as const).map((opt) => (
                                        <Pressable
                                            key={opt}
                                            className={clsx(
                                                'picker-option',
                                                frequency === opt && 'picker-option-active',
                                            )}
                                            onPress={() => setFrequency(opt)}
                                        >
                                            <Text
                                                className={clsx(
                                                    'picker-option-text',
                                                    frequency === opt && 'picker-option-text-active',
                                                )}
                                            >
                                                {opt}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>

                            <View className="auth-field">
                                <Text className="auth-label">Category</Text>
                                <View className="category-scroll">
                                    {CATEGORIES.map((cat) => (
                                        <Pressable
                                            key={cat}
                                            className={clsx(
                                                'category-chip',
                                                category === cat && 'category-chip-active',
                                            )}
                                            onPress={() =>
                                                setCategory((prev) => (prev === cat ? '' : cat))
                                            }
                                        >
                                            <Text
                                                className={clsx(
                                                    'category-chip-text',
                                                    category === cat && 'category-chip-text-active',
                                                )}
                                            >
                                                {cat}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>

                            <Pressable
                                className={clsx('auth-button', !isValid && 'auth-button-disabled')}
                                onPress={handleSubmit}
                                disabled={!isValid}
                            >
                                <Text className="auth-button-text">Add Subscription</Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}
