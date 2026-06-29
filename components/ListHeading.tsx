import {View, Text, TouchableOpacity} from 'react-native'
import {Link} from 'expo-router'
import React from 'react'

const ListHeading = ({ title, href }:ListHeadingProps) => {
    return (
        <View className={"list-head"}>
            <Text className={"list-title"}>{title}</Text>
            {href ? (
                <Link href={href as any} asChild>
                    <TouchableOpacity className={"list-action"}>
                        <Text className={"list-action-text"}>View all</Text>
                    </TouchableOpacity>
                </Link>
            ) : (
                <TouchableOpacity className={"list-action"}>
                    <Text className={"list-action-text"}>View all</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}
export default ListHeading
