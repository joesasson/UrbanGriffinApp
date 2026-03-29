import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  Animated,
} from 'react-native';
import { Images } from '../utils/images';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import gameIntro from '../data/gameIntro.json';
import { useSpeech } from '../hooks/useSpeech';
import SpeakButton from '../components/SpeakButton';

const SECTION_IMAGES = [
  Images.introductionBackground,          // 0: Welcome / selected
  Images.introductionBackground,          // 1: Never look up
  Images.grandCentralExterior,            // 2: Griffin description
  Images.grandCentralWhisperingGallery,   // 3: Stars on the ceiling
  Images.grandCentralConcourse,           // 4: Old notebook / history
  Images.grandCentralExterior,            // 5: 20 Keys
  Images.skySnatchers,                    // 6: Sky Snatchers rivals
  Images.skySnatchers,                    // 7: Hunt begins
];

const IntroductionScreen = ({ navigation }: any) => {
  const sections = gameIntro.introduction.sections;
  const { speak, stop, isSpeaking } = useSpeech();

  const [currentSection, setCurrentSection] = useState(0);
  const [displayedSection, setDisplayedSection] = useState(0);
  const [bgImage, setBgImage] = useState(SECTION_IMAGES[0]);
  const [nextBgImage, setNextBgImage] = useState(SECTION_IMAGES[0]);

  const bgOpacity = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    speak(sections[0].text);
  }, [sections, speak]);

  const goToSection = (index: number) => {
    const newImage = SECTION_IMAGES[index];
    const imageChanging = newImage !== SECTION_IMAGES[currentSection];

    Animated.timing(textOpacity, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setCurrentSection(index);
      setDisplayedSection(index);

      if (imageChanging) {
        setNextBgImage(newImage);
        Animated.timing(bgOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setBgImage(newImage);
          bgOpacity.setValue(1);
        });
      }

      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }).start(() => {
        speak(sections[index].text);
      });
    });
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      goToSection(currentSection + 1);
    } else {
      navigation.navigate('LandmarkMap');
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      goToSection(currentSection - 1);
    }
  };

  const handleSkip = () => {
    stop();
    navigation.navigate('LandmarkMap');
  };

  const isLast = currentSection === sections.length - 1;

  return (
    <View style={styles.container}>
      {/* Bottom background layer — next image */}
      <View style={StyleSheet.absoluteFill}>
        <ImageBackground source={nextBgImage} style={StyleSheet.absoluteFill} resizeMode="cover" />
      </View>

      {/* Top background layer — current image (fades out on change) */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: bgOpacity }]}>
        <ImageBackground source={bgImage} style={StyleSheet.absoluteFill} resizeMode="cover" />
      </Animated.View>

      {/* Gradient overlay: darkens bottom so text is readable */}
      <LinearGradient
        colors={['rgba(5,15,30,0.15)', 'rgba(5,15,30,0.55)', 'rgba(5,15,30,0.97)']}
        locations={[0.1, 0.45, 0.72]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>

        {/* Keeper header */}
        <View style={styles.keeperHeader}>
          <Image source={Images.theKeeper} style={styles.keeperPortrait} resizeMode="contain" />
          <Text style={styles.keeperEyebrow}>— The Keeper speaks —</Text>
        </View>

        {/* Spacer pushes text to bottom */}
        <View style={styles.spacer} />

        {/* Keeper text */}
        <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
          <Text style={styles.text}>{sections[displayedSection].text}</Text>
          <SpeakButton
            text={sections[displayedSection].text}
            speak={speak}
            stop={stop}
            isSpeaking={isSpeaking}
          />
        </Animated.View>

        {/* Progress dots */}
        <View style={styles.progressContainer}>
          {sections.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index < currentSection && styles.dotDone,
                index === currentSection && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          {currentSection > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.nextButton, isLast && styles.nextButtonFinal]}
            onPress={handleNext}
          >
            <Text style={[styles.nextText, isLast && styles.nextTextFinal]}>
              {isLast ? 'Begin the Hunt' : 'Continue →'}
            </Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050f1e',
  },
  safe: {
    flex: 1,
  },
  spacer: {
    flex: 1,
  },

  // Keeper header
  keeperHeader: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  keeperPortrait: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'rgba(212,175,55,0.6)',
    overflow: 'hidden',
  },
  keeperEyebrow: {
    fontFamily: 'CinzelDecorative_400Regular',
    fontSize: 11,
    color: 'rgba(212,175,55,0.85)',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  // Text
  textContainer: {
    paddingHorizontal: 24,
    paddingBottom: 4,
  },
  text: {
    color: '#e8e0cc',
    fontSize: 16,
    lineHeight: 27,
    fontWeight: '400',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // Progress dots
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dotDone: {
    backgroundColor: 'rgba(212,175,55,0.4)',
  },
  dotActive: {
    width: 22,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#d4af37',
  },

  // Buttons
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 10,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  skipText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: '500',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  backText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '500',
  },
  nextButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(212,175,55,0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(212,175,55,0.6)',
    alignItems: 'center',
  },
  nextButtonFinal: {
    backgroundColor: '#d4af37',
    borderColor: '#d4af37',
  },
  nextText: {
    color: '#d4af37',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  nextTextFinal: {
    color: '#050f1e',
  },
});

export default IntroductionScreen;
