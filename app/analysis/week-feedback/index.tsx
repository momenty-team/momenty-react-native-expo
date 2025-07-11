import TopNavigation from '@/components/TopNavigation';
import useSelectedDate from '@/stores/useSelectedDate';
import generateAiPromptHealthKitData from '@/utils/healthkit/generateAiPromptHealthKitData';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Pressable, Animated, Easing, Image } from 'react-native';
import { useEffect, useRef } from 'react';
import { Video, ResizeMode } from 'expo-av';

import { useState } from 'react';

const getRank = (score: string): 'none' | 'bronze' | 'silver' | 'gold' => {
  const numericScore = Number(score);
  if (numericScore >= 1 && numericScore <= 2) {
    return 'none';
  } else if (numericScore >= 3 && numericScore <= 4) {
    return 'bronze';
  } else if (numericScore >= 5 && numericScore <= 7) {
    return 'silver';
  } else if (numericScore >= 8 && numericScore <= 10) {
    return 'gold';
  } else {
    throw new Error('Invalid score: must be between 1 and 10');
  }
};

interface Feedback {
  title: string;
  level: string;
  feedback: string;
}

function WeekFeedback() {
  const insets = useSafeAreaInsets();
  const { day, month, year } = useSelectedDate();
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const contentFadeAnim = useRef(new Animated.Value(0)).current;
  const contentTranslateYAnim = useRef(new Animated.Value(20)).current;
  const videoOpacity = useRef(new Animated.Value(0)).current;
  const videoTranslateY = useRef(new Animated.Value(80)).current;
  const videoScale = useRef(new Animated.Value(0.2)).current;
  const medalOpacity = useRef(new Animated.Value(0)).current;
  const medalScale = useRef(new Animated.Value(1.2)).current;

  const onClickBack = () => {
    router.back();
  };

  const feedbackTestExample = async () => {
    setStep((p) => p + 1);
    const endDateObj = new Date(year, month - 1, day);
    const startDateObj = new Date(year, month - 1, day);
    startDateObj.setDate(startDateObj.getDate() - 6);

    try {
      const result = await generateAiPromptHealthKitData({
        startDate: startDateObj.toISOString(),
        endDate: endDateObj.toISOString(),
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStep((p) => p + 1);

      const res = await fetch(
        `https://api.momenty.co.kr/records/feedback?year=${year}&month=${month}&day=${day}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            health_kit: JSON.stringify(result),
          }),
        }
      );
      await new Promise((resolve) => setTimeout(resolve, 3000));

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      setFeedback(await res.json());
      setStep((p) => p % 1);
    } catch (error) {
      setStep(0);
      console.error('Error fetching health data:', error);
    }
  };

  useEffect(() => {
    if (!feedback) return;

    const titleTimeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
      ]).start();
    }, 200); // 0.2초 후 시작

    const contentTimeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(contentFadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(contentTranslateYAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
      ]).start();
    }, 400); // 0.4초 후 시작

    const medalTimeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(medalOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.sequence([
          Animated.timing(medalScale, {
            toValue: 0.96,
            duration: 200,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
          }),
          Animated.timing(medalScale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
          }),
        ]),
      ]).start();
    }, 600); // 0.4초 후 시작

    return () => {
      clearTimeout(titleTimeout);
      clearTimeout(contentTimeout);
      clearTimeout(medalTimeout);
    };
  }, [feedback]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(videoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(videoTranslateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.sequence([
        Animated.timing(videoScale, {
          toValue: 1.04,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(videoScale, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
      ]),
    ]).start();
  }, [step, videoOpacity, videoTranslateY, videoScale]);

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#fff' }}>
      <TopNavigation onClickBack={onClickBack} />
      <View style={styles.container}>
        {!feedback && (
          <>
            <View style={styles.titleContainer}>
              <View style={styles.titleWrapper}>
                <Text style={styles.title}>미래 조언</Text>
                <Text style={styles.title}>피드백을 드릴게요.</Text>
              </View>
              <Text style={styles.subTitle}>건강, 기록 정보를 분석해서 피드백을 드려요.</Text>
              <Text style={styles.subTitle}>
                일주일 동안의 데이터를 기반으로 피드백을 제공해요.
              </Text>

              <Animated.View
                style={{
                  opacity: videoOpacity,
                  transform: [{ translateY: videoTranslateY }, { scale: videoScale }],
                }}
              >
                <Video
                  source={require('../../../assets/glass-beard.mp4')}
                  resizeMode={ResizeMode.CONTAIN}
                  shouldPlay
                  isLooping
                  isMuted
                  style={{
                    width: 360,
                    height: 360,
                    marginRight: 12,
                    alignSelf: 'center',
                    backgroundColor: '#fff',
                  }}
                />
              </Animated.View>
            </View>
            <View style={styles.buttonWrapper}>
              <Text style={styles.label}>
                {step === 1 && '피드백을 받기 위해 정보를 정리하고 있어요.'}
                {step === 2 && 'AI가 정보를 분석 중이에요.'}
              </Text>

              <Pressable
                style={[styles.button, step !== 0 && { backgroundColor: '#E8EBEF' }]}
                onPress={feedbackTestExample}
                disabled={step !== 0}
              >
                <Text style={[styles.buttonText, step !== 0 && { color: '#5A6B7F' }]}>
                  {step === 0 ? '피드백 받기' : '피드백 생성중...'}
                </Text>
              </Pressable>
            </View>
          </>
        )}
        {feedback && (
          <View style={styles.titleContainer}>
            <Animated.View
              style={[
                styles.titleContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: translateYAnim }],
                },
              ]}
            >
              <Text style={styles.title}>{feedback.title}</Text>
              <Text style={styles.title}>{`이번주 생활 점수는 ${feedback.level}점!`}</Text>
            </Animated.View>
            {getRank(feedback.level) === 'gold' && (
              <Animated.Image
                source={require('../../../assets/images/gold-level.png')}
                style={[
                  styles.medalImage,
                  {
                    opacity: medalOpacity,
                    transform: [{ scale: medalScale }],
                  },
                ]}
              />
            )}

            {getRank(feedback.level) === 'silver' && (
              <Animated.Image
                source={require('../../../assets/images/silver-level.png')}
                style={[
                  styles.medalImage,
                  {
                    opacity: medalOpacity,
                    transform: [{ scale: medalScale }],
                  },
                ]}
              />
            )}
            {getRank(feedback.level) === 'bronze' && (
              <Animated.Image
                source={require('../../../assets/images/bronze-level.png')}
                style={[
                  styles.medalImage,
                  {
                    opacity: medalOpacity,
                    transform: [{ scale: medalScale }],
                  },
                ]}
              />
            )}
            {getRank(feedback.level) === 'none' && (
              <Image
                source={require('../../../assets/images/none-level.png')}
                style={[
                  styles.medalImage,
                  {
                    opacity: medalOpacity,
                    transform: [{ scale: medalScale }],
                  },
                ]}
              />
            )}

            <Animated.Text
              style={[
                styles.content,
                {
                  opacity: contentFadeAnim,
                  transform: [{ translateY: contentTranslateYAnim }],
                },
              ]}
            >
              {feedback.feedback}
            </Animated.Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default WeekFeedback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 54,
    paddingHorizontal: 24,
  },
  titleContainer: {
    display: 'flex',
  },
  titleWrapper: {
    display: 'flex',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'SUIT-Variable',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 40,
    zIndex: 1,
  },
  subTitle: {
    fontFamily: 'SUIT Variable',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: '#5A6B7F',
    zIndex: 1,
  },
  content: {
    fontFamily: 'SUIT Variable',
    fontSize: 20,
    fontWeight: 400,
    lineHeight: 28,
    marginTop: 48,
    color: '#222',
  },
  buttonWrapper: {
    display: 'flex',
  },
  button: {
    backgroundColor: '#021730',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    fontFamily: 'SUIT Variable',
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 28,
    color: '#F4F6F9',
  },
  label: {
    display: 'flex',
    textAlign: 'center',
    color: '#5A6B7F',
    fontFamily: 'SUIT Variable',
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 20,
  },
  medalImage: {
    width: 160,
    height: 200,
    marginTop: 48,
    alignSelf: 'center',
    zIndex: 1,
  },
});
