import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import type { Ref } from 'react';
import { Pressable, StyleSheet, View, type ViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import {
  MaxContentWidth,
  Radius,
  Spacing,
  TabBarHeight,
  TabBarItemSize,
} from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={styles.slot} />
      <TabList asChild>
        <FloatingTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabIconButton icon="home" label="Home" />
          </TabTrigger>
          <TabTrigger name="grades" href="/grades" asChild>
            <TabIconButton icon="grades" label="Grades" />
          </TabTrigger>
          <TabTrigger name="attendance" href="/attendance" asChild>
            <TabIconButton icon="attendance" label="Attendance" />
          </TabTrigger>
          <TabTrigger name="profile" href="/profile" asChild>
            <TabIconButton icon="profile" label="Profile" />
          </TabTrigger>
        </FloatingTabList>
      </TabList>
    </Tabs>
  );
}

type TabIconButtonProps = TabTriggerSlotProps & { icon: AppIconName; label: string };

function TabIconButton({ icon, label, isFocused, ref, ...props }: TabIconButtonProps) {
  const theme = useTheme();
  // expo-router types the slot ref as the pre-0.88 View component; at runtime it receives the View instance
  const pressableRef = ref as unknown as Ref<ViewInstance>;

  return (
    <Pressable
      {...props}
      ref={pressableRef}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={label}
      style={[styles.item, { backgroundColor: isFocused ? theme.accent : 'transparent' }]}>
      <AppIcon name={icon} color={isFocused ? 'onAccent' : 'tabBarIcon'} />
    </Pressable>
  );
}

function FloatingTabList(props: TabListProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <View
      {...props}
      accessibilityRole="tablist"
      pointerEvents="box-none"
      style={[styles.row, { bottom: insets.bottom + Spacing.three }]}>
      <View style={[styles.pill, { backgroundColor: theme.tabBar }]}>{props.children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    flex: 1,
  },
  row: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
  },
  pill: {
    width: '100%',
    maxWidth: MaxContentWidth,
    height: TabBarHeight,
    borderRadius: Radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  item: {
    width: TabBarItemSize,
    height: TabBarItemSize,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
