import React, { Children, cloneElement } from 'react';
import {
  StyleSheet,
  ScrollView,
  StyleProp,
  ViewStyle,
  View,
} from 'react-native';
import { useTheme } from 'react-native-paper';

const useHorizontalListStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    child: {
      marginHorizontal: theme.spacing(0.25),
    },
    firstChild: {
      marginHorizontal: theme.spacing(0.25),
      marginLeft: theme.spacing(0.5),
    },
    lastChild: {
      marginHorizontal: theme.spacing(0.25),
      marginRight: theme.spacing(0.5),
    },
    container: {
      alignItems: 'flex-end',
    },
  });
};

/**
 * A horizontal list view, to allow cards, chips etc
 * to be horizontally scrollable in a list. Includes added margin
 */
export const HorizontalListScroll: React.FC<{
  style?: StyleProp<ViewStyle>;
  nestedScrollEnabled?: boolean;
}> = ({ children, ...props }) => {
  const styles = useHorizontalListStyles();
  const totalChildren = Children.count(children);
  if (totalChildren === 0) return null;
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      horizontal
      centerContent={true}
      showsHorizontalScrollIndicator={false}
      {...props}
      >
      {Children.map(children, (child, index) => {
        // First child
        if (index < 1)
          return cloneElement(child as any, {
            style: styles.firstChild,
          });

        if (index === totalChildren - 1) {
          return cloneElement(child as any, {
            style: styles.lastChild,
          });
        }
        return cloneElement(child as any, {
          style: styles.child,
        });
      })}
    </ScrollView>
  );
};

const useHorizontalListFlexStyles = () => {
  const baseStyles = useHorizontalListStyles();
  const flexStyles = StyleSheet.create({
    child: { flex: 1 },
    firstChild: { flex: 1 },
    lastChild: { flex: 1 },
    container: { flexDirection: 'row' },
  });
  return {
    child: StyleSheet.compose<ViewStyle>(baseStyles.child, flexStyles.child),
    firstChild: StyleSheet.compose<ViewStyle>(
      baseStyles.firstChild,
      flexStyles.firstChild
    ),
    lastChild: StyleSheet.compose<ViewStyle>(
      baseStyles.lastChild,
      flexStyles.lastChild
    ),
    container: StyleSheet.compose<ViewStyle>(
      baseStyles.container,
      flexStyles.container
    ),
  };
};

/**
 * A horizontal list where all the children are in a flexbox
 * and will use flex to limit its size to the container
 */
export const HorizontalListFlex: React.FC = ({ children }) => {
  const styles = useHorizontalListFlexStyles();
  const totalChildren = Children.count(children);
  if (totalChildren === 0) return null;
  return (
    <View style={styles.container}>
      {Children.map(children, (child, index) => {
        // First child
        if (index < 1)
          return cloneElement(child as any, {
            style: styles.firstChild,
          });

        // Last child
        if (index === totalChildren - 1) {
          return cloneElement(child as any, {
            style: styles.lastChild,
          });
        }
        return cloneElement(child as any, {
          style: styles.child,
        });
      })}
    </View>
  );
};
