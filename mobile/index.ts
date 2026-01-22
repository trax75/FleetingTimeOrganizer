import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { widgetTaskHandler } from './src/widgets/widgetTaskHandler';

// Register widget task handler
registerWidgetTaskHandler(widgetTaskHandler);

// Re-export expo-router entry
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - expo-router/entry has no type declarations
import 'expo-router/entry';
