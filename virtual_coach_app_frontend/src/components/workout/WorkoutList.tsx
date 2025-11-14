/**
 * WorkoutList Component (Redesigned)
 * Displays workout plan with matcha green theme, WorkoutSummary, and action buttons
 */

import { useState } from 'react';
import { Container, Stack, Button, Group, Paper, Text } from '@mantine/core';
import { WorkoutCard } from './WorkoutCard';
import { WorkoutSummary } from './WorkoutSummary';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { matchaGreen } from '../../theme/colors';
import type { WorkoutPlan } from '../../types/dataModel';

/**
 * WorkoutList Props
 */
export interface WorkoutListProps {
  workoutPlan: WorkoutPlan;
  onStartTraining?: () => void;
  onRegenerate?: () => void;
}

/**
 * 訓練計畫列表組件 (重新設計)
 * 
 * 整合 WorkoutSummary、垂直滾動卡片列表、操作按鈕區塊
 */
export function WorkoutList({ workoutPlan, onStartTraining, onRegenerate }: WorkoutListProps) {
  const { exercises, estimatedDurationMinutes, preferences } = workoutPlan;
  const [confirmDialogOpened, setConfirmDialogOpened] = useState(false);

  // 計算難度
  const difficulty = preferences.difficultyLevel;

  const handleRegenerateClick = () => {
    setConfirmDialogOpened(true);
  };

  const handleConfirmRegenerate = () => {
    setConfirmDialogOpened(false);
    if (onRegenerate) {
      onRegenerate();
    }
  };

  return (
    <Container size="lg" px={{ base: 'md', sm: 'lg', md: 'xl' }}>
      <Stack gap={{ base: 'lg', md: 'xl' }}>
        {/* 標題 */}
        <div>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '8px',
          }}>
            您的訓練計畫
          </h2>
          <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
            根據您的偏好客製化的訓練菜單
          </p>
        </div>

        {/* WorkoutSummary 摘要 */}
        <WorkoutSummary
          totalDurationMinutes={estimatedDurationMinutes}
          exerciseCount={exercises.length}
          difficulty={difficulty}
        />

        {/* 運動卡片列表 - 垂直滾動 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxHeight: 'none',
            overflowY: 'visible',
            paddingRight: '8px',
            paddingBottom: '16px',
          }}
        >
          {exercises.map((item, index) => (
            <WorkoutCard key={index} item={item} index={index} />
          ))}
        </div>

        {/* 操作按鈕區塊 */}
        <div
          style={{
            position: 'sticky',
            bottom: 0,
            backgroundColor: 'white',
            padding: '16px 0',
            borderTop: `2px solid ${matchaGreen[100]}`,
          }}
        >
          <Group gap="md" grow>
            {onStartTraining && (
              <Button
                onClick={onStartTraining}
                size="lg"
                style={{
                  backgroundColor: matchaGreen[500],
                  color: 'white',
                  height: '56px',
                  minHeight: '44px', // Touch-friendly
                  fontSize: '16px',
                  fontWeight: 600,
                  borderRadius: '12px',
                }}
                styles={{
                  root: {
                    '&:hover': {
                      backgroundColor: matchaGreen[600],
                    },
                  },
                }}
              >
                開始訓練
              </Button>
            )}
            {onRegenerate && (
              <Button
                onClick={handleRegenerateClick}
                size="lg"
                variant="outline"
                style={{
                  borderColor: matchaGreen[500],
                  color: matchaGreen[600],
                  height: '56px',
                  minHeight: '44px', // Touch-friendly
                  fontSize: '16px',
                  fontWeight: 600,
                  borderRadius: '12px',
                  borderWidth: '2px',
                }}
              >
                重新生成
              </Button>
            )}
          </Group>
        </div>

        {/* 確認對話框 */}
        <ConfirmDialog
          opened={confirmDialogOpened}
          onClose={() => setConfirmDialogOpened(false)}
          onConfirm={handleConfirmRegenerate}
          title="重新生成訓練計畫"
          message="確定要重新生成訓練計畫嗎？目前的計畫將會被清除。"
          confirmLabel="確定重新生成"
          cancelLabel="取消"
        />

        {/* 提示訊息 - 淡綠色主題，文字置中 */}
        <Paper
          p="md"
          radius="md"
          style={{
            backgroundColor: matchaGreen[50],
            border: `1px solid ${matchaGreen[200]}`,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg
                style={{ width: '20px', height: '20px', color: matchaGreen[600], flexShrink: 0 }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <Text size="sm" fw={600} c={matchaGreen[800]}>
                訓練小提示
              </Text>
            </div>
            <ul style={{ 
              fontSize: '14px', 
              color: matchaGreen[700], 
              margin: 0, 
              paddingLeft: '0',
              listStyle: 'none',
              textAlign: 'center',
              width: '100%',
              maxWidth: '500px'
            }}>
              <li>訓練前請先做 5-10 分鐘暖身運動</li>
              <li>注意動作正確性，避免受傷</li>
              <li>依照自己的身體狀況調整強度</li>
              <li>運動後記得做伸展放鬆</li>
            </ul>
          </div>
        </Paper>
      </Stack>
    </Container>
  );
}
