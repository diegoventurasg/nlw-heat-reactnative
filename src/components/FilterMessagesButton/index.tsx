import React from 'react';

import { View, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { styles } from './styles';

type Props = TouchableOpacityProps & {
    title: string;
    selected: boolean;
}

export function FilterMessagesButton({
    title,
    selected = false,
    ...rest
}: Props) {

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.7}
            {...rest}
        >
            <Text style={selected ? styles.titleSelected : styles.title} >
                {title}
            </Text>
        </TouchableOpacity>
    );
}