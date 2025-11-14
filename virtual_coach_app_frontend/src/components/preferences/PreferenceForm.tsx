import { useState, FormEvent } from 'react';
import { Container, Stack, SimpleGrid, Button as MantineButton, Loader } from '@mantine/core';
import { TrainingGoal, TargetMuscle, DifficultyLevel } from '../../types/enums';
import { validatePreferences } from '../../utils/validators';
import { PreferenceCard } from './PreferenceCard';
import { OptionButton } from './OptionButton';
import { DurationSlider } from './DurationSlider';
import { matchaGreen } from '../../theme/colors';
import type { UserPreferences } from '../../types/dataModel';

/**
 * PreferenceForm Props
 */
export interface PreferenceFormProps {
  onSubmit: (preferences: UserPreferences) => void;
  isLoading?: boolean;
}

/**
 * 偏好設定表單組件
 * 
 * 讓用戶選擇訓練目標、目標肌群、難度等級和可用時間
 */
export function PreferenceForm({ onSubmit, isLoading = false }: PreferenceFormProps) {
  const [trainingGoal, setTrainingGoal] = useState<TrainingGoal | ''>('');
  const [targetMuscles, setTargetMuscles] = useState<TargetMuscle[]>([]);
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel | ''>('');
  const [availableMinutes, setAvailableMinutes] = useState<number>(30);
  const [errors, setErrors] = useState<string[]>([]);

  /**
   * 處理肌群多選
   */
  const handleMuscleToggle = (muscle: TargetMuscle) => {
    setTargetMuscles((prev) =>
      prev.includes(muscle)
        ? prev.filter((m) => m !== muscle)
        : [...prev, muscle]
    );
  };

  /**
   * 處理表單提交
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // 驗證輸入
    const preferences: Partial<UserPreferences> = {
      trainingGoal: trainingGoal || undefined,
      targetMuscles,
      difficultyLevel: difficultyLevel || undefined,
      availableMinutes,
    };

    const validation = validatePreferences(preferences);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // 提交表單
    onSubmit(preferences as UserPreferences);
  };

  return (
    <Container 
      size="md" 
      py="xl"
      px={{ base: 'md', sm: 'lg', md: 'xl' }}
      style={{ maxWidth: '1200px' }}
    >
      <form onSubmit={handleSubmit}>
        <Stack gap={{ base: 'lg', md: 'xl' }}>
          {/* 錯誤訊息 */}
          {errors.length > 0 && (
            <PreferenceCard
              title="請完成必填項目"
              badges={[{ label: '錯誤', color: 'red' }]}
              variant="outlined"
            >
              <Stack gap="xs">
                {errors.map((error, index) => (
                  <div key={index} style={{ color: '#EF5350', fontSize: '14px' }}>
                    • {error}
                  </div>
                ))}
              </Stack>
            </PreferenceCard>
          )}

          {/* 訓練目標 */}
          <PreferenceCard
            title="訓練目標"
            description="選擇您的健身目標"
            badges={[{ label: '必填', color: 'red' }]}
          >
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              <OptionButton
                icon={<span>💪</span>}
                label="增肌"
                value={TrainingGoal.MUSCLE_GAIN}
                selected={trainingGoal === TrainingGoal.MUSCLE_GAIN}
                onChange={(value) => setTrainingGoal(value as TrainingGoal)}
              />
              <OptionButton
                icon={<span>🔥</span>}
                label="減脂"
                value={TrainingGoal.WEIGHT_LOSS}
                selected={trainingGoal === TrainingGoal.WEIGHT_LOSS}
                onChange={(value) => setTrainingGoal(value as TrainingGoal)}
              />
              <OptionButton
                icon={<span>🏃</span>}
                label="耐力"
                value={TrainingGoal.ENDURANCE}
                selected={trainingGoal === TrainingGoal.ENDURANCE}
                onChange={(value) => setTrainingGoal(value as TrainingGoal)}
              />
            </SimpleGrid>
          </PreferenceCard>

          {/* 目標肌群 */}
          <PreferenceCard
            title="目標肌群"
            description="可選擇一個或多個目標部位"
            badges={[{ label: '必填', color: 'red' }, { label: '可多選', color: 'green' }]}
          >
            <SimpleGrid cols={{ base: 2, sm: 3, md: 3 }} spacing="md">
              {Object.values(TargetMuscle).map((muscle) => (
                <OptionButton
                  key={muscle}
                  icon={<span>{getMuscleIcon(muscle)}</span>}
                  label={getMuscleLabel(muscle)}
                  value={muscle}
                  selected={targetMuscles.includes(muscle)}
                  onChange={() => handleMuscleToggle(muscle)}
                />
              ))}
            </SimpleGrid>
          </PreferenceCard>

          {/* 難度等級 */}
          <PreferenceCard
            title="難度等級"
            description="根據您的訓練經驗選擇"
            badges={[{ label: '必填', color: 'red' }]}
          >
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              <OptionButton
                icon={<span>🌱</span>}
                label="初學者"
                value={DifficultyLevel.BEGINNER}
                selected={difficultyLevel === DifficultyLevel.BEGINNER}
                onChange={(value) => setDifficultyLevel(value as DifficultyLevel)}
              />
              <OptionButton
                icon={<span>🌿</span>}
                label="中階"
                value={DifficultyLevel.INTERMEDIATE}
                selected={difficultyLevel === DifficultyLevel.INTERMEDIATE}
                onChange={(value) => setDifficultyLevel(value as DifficultyLevel)}
              />
              <OptionButton
                icon={<span>🌳</span>}
                label="進階"
                value={DifficultyLevel.ADVANCED}
                selected={difficultyLevel === DifficultyLevel.ADVANCED}
                onChange={(value) => setDifficultyLevel(value as DifficultyLevel)}
              />
            </SimpleGrid>
          </PreferenceCard>

          {/* 可用時間 */}
          <PreferenceCard
            title="訓練時長"
            description="設定您可以訓練的時間長度"
            badges={[{ label: '必填', color: 'red' }]}
          >
            <DurationSlider
              label="可用時間"
              value={availableMinutes}
              min={15}
              max={60}
              step={5}
              onChange={setAvailableMinutes}
            />
          </PreferenceCard>

          {/* 提交按鈕 */}
          <MantineButton
            type="submit"
            size="lg"
            fullWidth
            disabled={isLoading}
            style={{
              backgroundColor: matchaGreen[500],
              color: 'white',
              fontSize: '16px',
              fontWeight: 600,
              height: '56px',
              minHeight: '44px', // Touch-friendly
            }}
            styles={{
              root: {
                '&:hover': {
                  backgroundColor: matchaGreen[600],
                },
                '@media (max-width: 767px)': {
                  height: '48px',
                  fontSize: '16px',
                },
              },
            }}
          >
            {isLoading ? (
              <>
                <Loader size="sm" color="white" mr="sm" />
                生成中...
              </>
            ) : (
              '生成訓練計畫'
            )}
          </MantineButton>
        </Stack>
      </form>
    </Container>
  );
}

/**
 * 取得肌群圖示
 */
function getMuscleIcon(muscle: TargetMuscle): string {
  const icons: Record<TargetMuscle, string> = {
    [TargetMuscle.CHEST]: '🫁',
    [TargetMuscle.BACK]: '🔙',
    [TargetMuscle.LEGS]: '🦵',
    [TargetMuscle.SHOULDERS]: '💪',
    [TargetMuscle.ARMS]: '💪',
    [TargetMuscle.CORE]: '⚡',
  };
  return icons[muscle] || '💪';
}

/**
 * 取得肌群顯示名稱
 */
function getMuscleLabel(muscle: TargetMuscle): string {
  const labels: Record<TargetMuscle, string> = {
    [TargetMuscle.CHEST]: '胸部',
    [TargetMuscle.BACK]: '背部',
    [TargetMuscle.LEGS]: '腿部',
    [TargetMuscle.SHOULDERS]: '肩膀',
    [TargetMuscle.ARMS]: '手臂',
    [TargetMuscle.CORE]: '核心',
  };
  return labels[muscle] || muscle;
}
