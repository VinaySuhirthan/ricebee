import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {TableColumn} from '../types/common';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {radii, spacing} from '../theme/spacing';

export interface AppTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  onRowPress?: (item: T) => void;
  emptyText?: string;
  style?: StyleProp<ViewStyle>;
}

export function AppTable<T>({
  columns,
  data,
  keyExtractor,
  onRowPress,
  emptyText = 'No records found',
  style,
}: AppTableProps<T>) {
  return (
    <View style={[styles.tableContainer, style]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View style={styles.tableInner}>
          {/* Header */}
          <View style={styles.headerRow}>
            {columns.map(col => {
              const widthStyle =
                typeof col.width === 'number'
                  ? {width: col.width}
                  : typeof col.width === 'string' && col.width !== 'auto'
                  ? {width: col.width}
                  : {flex: 1, minWidth: 120};

              const alignStyle =
                col.align === 'right'
                  ? styles.alignRight
                  : col.align === 'center'
                  ? styles.alignCenter
                  : styles.alignLeft;

              return (
                <View
                  key={col.key}
                  style={[styles.headerCell, widthStyle, alignStyle]}>
                  <Text style={[typography.sectionHeading, styles.headerText]}>
                    {col.title}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Rows */}
          {data.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[typography.body, styles.emptyText]}>
                {emptyText}
              </Text>
            </View>
          ) : (
            data.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <Pressable
                  key={keyExtractor(item, index)}
                  onPress={onRowPress ? () => onRowPress(item) : undefined}
                  style={({pressed}) => [
                    styles.row,
                    isEven ? styles.rowEven : styles.rowOdd,
                    pressed && onRowPress ? styles.rowPressed : null,
                  ]}>
                  {columns.map(col => {
                    const widthStyle =
                      typeof col.width === 'number'
                        ? {width: col.width}
                        : typeof col.width === 'string' && col.width !== 'auto'
                        ? {width: col.width}
                        : {flex: 1, minWidth: 120};

                    const alignStyle =
                      col.align === 'right'
                        ? styles.alignRight
                        : col.align === 'center'
                        ? styles.alignCenter
                        : styles.alignLeft;

                    const cellContent = col.render
                      ? col.render(item, index)
                      : (item as Record<string, unknown>)[
                          col.key
                        ]?.toString() ?? '-';

                    return (
                      <View
                        key={col.key}
                        style={[styles.cell, widthStyle, alignStyle]}>
                        {typeof cellContent === 'string' ||
                        typeof cellContent === 'number' ? (
                          <Text
                            style={[typography.body, styles.cellText]}
                            numberOfLines={1}>
                            {cellContent}
                          </Text>
                        ) : (
                          cellContent
                        )}
                      </View>
                    );
                  })}
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    backgroundColor: colors.cardBg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
    marginVertical: spacing.sm,
  },
  tableInner: {
    minWidth: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#0F1829',
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  headerCell: {
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  headerText: {
    color: colors.textSecondary,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 47, 77, 0.4)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  rowEven: {
    backgroundColor: colors.cardBg,
  },
  rowOdd: {
    backgroundColor: colors.tableRowAlt,
  },
  rowPressed: {
    backgroundColor: colors.sidebarHover,
  },
  cell: {
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  cellText: {
    color: colors.textPrimary,
    fontSize: 13,
  },
  alignLeft: {
    alignItems: 'flex-start',
  },
  alignCenter: {
    alignItems: 'center',
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.textMuted,
  },
});

export default AppTable;
