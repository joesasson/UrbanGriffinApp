import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

const styles = StyleSheet.create({
  flex: { flex: 1 },
});

type Props = Omit<ScrollViewProps, 'contentContainerStyle'> & {
  children: React.ReactNode;
  contentContainerStyle?: ViewStyle | ViewStyle[] | undefined;
};

/**
 * Stack screens with TextInputs: keeps the focused field above the keyboard.
 */
export function KeyboardAvoidingScroll({
  children,
  contentContainerStyle,
  ...scrollProps
}: Props) {
  const headerHeight = useHeaderHeight();
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}
        {...scrollProps}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
