import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface TimerWidgetProps {
  timerName: string;
  percent: number;
  timeRemaining: string;
}

export function TimerWidget({ timerName, percent, timeRemaining }: TimerWidgetProps) {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#1a1a2e',
        borderRadius: 16,
        padding: 12,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      clickAction="OPEN_APP"
    >
      {/* Timer Name */}
      <TextWidget
        text={timerName}
        style={{
          fontSize: 14,
          fontWeight: '600',
          color: '#ffffff',
        }}
        maxLines={1}
      />

      {/* Percentage - Large */}
      <TextWidget
        text={`${percent.toFixed(1)}%`}
        style={{
          fontSize: 24,
          fontWeight: '700',
          color: '#0ea5e9',
        }}
      />

      {/* Time Remaining */}
      <TextWidget
        text={timeRemaining}
        style={{
          fontSize: 11,
          color: '#888888',
        }}
        maxLines={1}
      />
    </FlexWidget>
  );
}

// Default widget shown when no timer is configured
export function TimerWidgetDefault() {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#1a1a2e',
        borderRadius: 16,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      clickAction="OPEN_APP"
    >
      <TextWidget
        text="Tap to configure"
        style={{
          fontSize: 14,
          color: '#888888',
        }}
      />
    </FlexWidget>
  );
}
