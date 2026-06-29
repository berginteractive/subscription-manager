import { createContext, useContext, useState, type ReactNode } from 'react'
import { HOME_SUBSCRIPTIONS } from '@/constants/data'

interface SubscriptionsContextValue {
    subscriptions: Subscription[]
    addSubscription: (s: Subscription) => void
}

const SubscriptionsContext = createContext<SubscriptionsContextValue | null>(null)

export function SubscriptionsProvider({ children }: { children: ReactNode }) {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>(HOME_SUBSCRIPTIONS)

    const addSubscription = (s: Subscription) => {
        setSubscriptions((prev) => [s, ...prev])
    }

    return (
        <SubscriptionsContext.Provider value={{ subscriptions, addSubscription }}>
            {children}
        </SubscriptionsContext.Provider>
    )
}

export function useSubscriptions() {
    const ctx = useContext(SubscriptionsContext)
    if (!ctx) throw new Error('useSubscriptions must be used within SubscriptionsProvider')
    return ctx
}
