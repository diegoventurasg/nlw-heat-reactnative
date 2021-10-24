import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../theme';

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 14,
        fontFamily: FONTS.BOLD,
        color: COLORS.WHITE,
    },
    titleSelected: {
        fontSize: 14,
        fontFamily: FONTS.BOLD,
        color: COLORS.ORANGE,
    },
});