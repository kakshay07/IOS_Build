import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View,  StyleSheet, Animated } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';


export default function Index() {
  const navigation = useNavigation();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1100,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to Login screen after delay
    const timer = setTimeout(() => {
      router.replace("/login"); // Redirect to login.tsx after animation
    }, 2800);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, scaleAnim]);
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#5e35b1', '#7b1fa2', '#4a148c']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        <View style={styles.contentContainer}>
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* Replace with your actual logo */}
            {/* <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            /> */}
          </Animated.View>
          
          <Animated.Text
            style={[
              styles.appName,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            MHFSL Login App
          </Animated.Text>
          
          <Animated.Text
            style={[
              styles.tagline,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            Secure. Simple. Seamless.
          </Animated.Text>
          
          <Animated.View
            style={[
              styles.loadingContainer,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <View style={styles.loadingBar}>
              <Animated.View 
                style={[
                  styles.loadingProgress,
                  {       transform: [
                    {
                      scaleX: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1] // Instead of using "0%", use 0
                      })
                    }
                  ]
                  }
                ]} 
              />
            </View>
          </Animated.View>
        </View>
        
        <Animated.Text
          style={[
            styles.versionText,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          Version 1.0.0
        </Animated.Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 100,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  logo: {
    width: 140,
    height: 140,
    tintColor: '#ffffff',
  },
  appName: {
    marginTop: 25,
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  tagline: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 1,
  },
  loadingContainer: {
    marginTop: 40,
    width: '70%',
    alignItems: 'center'
  },
  loadingBar: {
    height: 6,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 3,
  },
  versionText: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});