import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, Image, Dimensions } from 'react-native';
import Sparkles from './components/Sparkles';
import { Linking, TouchableOpacity } from 'react-native';
const { width, height } = Dimensions.get('window');

const sparkleOptions = [
  {
    label: 'Default Sparkles',
    value: 'default',
    props: {},
  },
  {
    label: 'Tiny Sparkles',
    value: 'tiny',
    props: {
      shapes: ['circle'],
      explosionForce: { min: 100, max: 150 },
      size: { min: 1, max: 2 },
      duration: 200,
      gravity: 500,
    },
  },
  {
    label: 'Rainbow Explosion',
    value: 'rainbow',
    props: {
      colors: [
        '#FF1744', '#F50057', '#D500F9', '#651FFF',
        '#2979FF', '#00E676', '#FFEA00', '#FF9100',
      ],
      shapes: ['circle', 'triangle', 'star'],
      explosionForce: { min: 500, max: 700 },
      particleCount: 80,
    },
  },
  {
    label: 'Explosive Stars',
    value: 'stars',
    props: {
      colors: ['#FFD600', '#FF3D00', '#D50000', '#FFF9C4'],
      shapes: [
        'star', 'star', 'star', 'star', 'star',
        'star', 'star', 'star', 'star', 'triangle',
      ],
      explosionForce: { min: 800, max: 1500 },
      particleCount: 100,
      duration: 1300,
      gravity: 1000,
    },
  },
  {
    label: 'Firework',
    value: 'firework',
    props: {
      colors: [
        '#FFF', '#FFD700', '#FF1744',
        '#00E676', '#2979FF', '#F50057',
      ],
      shapes: ['circle'],
      explosionForce: { min: 200, max: 300 },
      particleCount: 48,
      duration: 800,
      direction: 'radial',
      burst: true,
      trail: true,
      singleColor: true,
      gravity: 400,
      size: { min: 4, max: 7 },
      trailLength: 6,
      rotateParticles: false,
    },
  },
  {
    label: 'Confetti',
    value: 'confetti',
    props: {
      colors: [
        '#FF1744', '#F50057', '#FFD600',
        '#00E676', '#2979FF', '#FF9100', '#00B8D4',
      ],
      shapes: ['rect', 'circle', 'triangle'],
      particleCount: 150,
      duration: 1500,
      burst: false,
      trail: false,
      gravity: 800,
      size: { min: 5, max: 9 },
      spreadAngle: 30,
      fanDirection: -90,
      rotateParticles: true,
    },
  },
];

export default function App() {
  const [selected, setSelected] = useState(sparkleOptions[0]);
  const [showSparkles, setShowSparkles] = useState(false);
  const [sparklesKey, setSparklesKey] = useState(0);
  const [pressLocation, setPressLocation] = useState({ x: 0, y: 0 });
  const [sparkleProps, setSparkleProps] = useState({});

  const handlePressAnywhere = useCallback((event) => {
    const { pageX, pageY } = event.nativeEvent;
    setPressLocation({ x: pageX, y: pageY });
    setSparkleProps(selected.props);
    setSparklesKey(prevKey => prevKey + 1);
    setShowSparkles(true);
  }, [selected]);

  const handleAnimationComplete = useCallback(() => {
    setShowSparkles(false);
  }, []);

  return (
      <View style={styles.background}>
        <Image
            source={require('./assets/mario-highfive.png')}
            style={styles.mario}
            resizeMode="contain"
        />
        <Pressable style={styles.container} onPress={handlePressAnywhere}>
          <View style={styles.optionsColumn}>
            {sparkleOptions.map(opt => (
                <Pressable
                    key={opt.value}
                    style={[
                      styles.optionButton,
                      selected.value === opt.value && styles.optionButtonSelected,
                    ]}
                    onPress={() => setSelected(opt)}
                >
                  <Text
                      style={[
                        styles.optionButtonText,
                        selected.value === opt.value && styles.optionButtonTextSelected,
                      ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
            ))}
          </View>
          <Sparkles
              key={sparklesKey}
              show={showSparkles}
              location={pressLocation}
              onComplete={handleAnimationComplete}
              {...sparkleProps}
          />
        </Pressable>
        <TouchableOpacity
            style={styles.creditContainer}
            onPress={() => Linking.openURL('https://www.deviantart.com/bandicootbrawl96/art/Mario-and-Luigi-High-Five-Render-882057573')}
            activeOpacity={0.7}
        >
          <Text style={styles.creditText}>
            Image: bandicootbrawl96 @ DeviantArt
          </Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  optionsColumn: {
    position: 'absolute',
    top: 32,
    left: 0,
    right: 0,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    paddingTop: 20,
  },
  optionButton: {
    backgroundColor: '#222',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  optionButtonSelected: {
    backgroundColor: '#FFD600',
  },
  optionButtonText: {
    color: '#fff',
    fontSize: 15,
  },
  optionButtonTextSelected: {
    color: '#222',
    fontWeight: 'bold',
  },
  mario: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: width * 0.7,
    height: height * 0.45,
    pointerEvents: 'none',
  },

  creditContainer: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 10,
  },
  creditText: {
    color: '#fff',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});