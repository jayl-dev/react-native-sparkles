// components/Sparkles.js
import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    withDelay,
    Easing,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const DEFAULT_COLORS = [
    '#FFFFFF', '#FFFDE7', '#FFF9C4',
    '#FFEB3B', '#FDD835', '#FBC02D',
    '#FFA726', '#FF9800', '#FB8C00',
];
const DEFAULT_SHAPES = ['circle', 'triangle', 'star'];
const DEFAULT_EXPLOSION_FORCE = { min: 300, max: 700 };

function getParticleProps({
                              index, particleCount, duration, shapes, colors, explosionForce, direction, burst,
                              gravityOverride, singleColor, colorOverride, size, spreadAngle, fanDirection, rotateParticles
                          }) {
    let angle;
    if (burst) {
        angle = ((2 * Math.PI) / Math.max(1, particleCount)) * index;
    } else if (spreadAngle && fanDirection !== undefined) {
        const base = fanDirection * (Math.PI / 180);
        const spread = spreadAngle * (Math.PI / 180);
        angle = particleCount > 1
            ? base - spread / 2 + (spread * index) / (particleCount - 1)
            : base;
    } else {
        let baseAngleDegrees = direction === 'radial' ? -90 : (typeof direction === 'number' ? direction : -90);
        const angleOffsetDegrees = (Math.random() - 0.5) * 120;
        angle = (baseAngleDegrees + angleOffsetDegrees) * (Math.PI / 180);
    }
    const velocity = (explosionForce?.min ?? DEFAULT_EXPLOSION_FORCE.min) +
        Math.random() * ((explosionForce?.max ?? DEFAULT_EXPLOSION_FORCE.max) - (explosionForce?.min ?? DEFAULT_EXPLOSION_FORCE.min));
    const gravity = gravityOverride !== undefined ? gravityOverride : (800 + Math.random() * 600);
    const startOffsetX = (Math.random() - 0.5) * 4;
    const startOffsetY = (Math.random() - 0.5) * 4;
    const delay = Math.random() * 50;
    const rotationSpeed = rotateParticles
        ? (Math.random() - 0.5) * 2000
        : (Math.random() - 0.5) * 1000;
    const particleSize = size.min + Math.random() * (size.max - size.min);
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const color = singleColor ? colorOverride : colors[Math.floor(Math.random() * colors.length)];
    const initialVelX = Math.cos(angle) * velocity;
    const initialVelY = Math.sin(angle) * velocity;
    const baseParticleDuration = duration || 500;
    const particleDuration = baseParticleDuration + Math.random() * 250;
    return { angle, velocity, gravity, rotationSpeed, size: particleSize, shape, color, initialVelX, initialVelY, startOffsetX, startOffsetY, particleDuration, delay: Math.max(0, delay) };
}

const SparkleParticle = (props) => {
    const {
        index, show, particleCount, duration, shapes, colors, explosionForce, direction, burst,
        gravity, singleColor, colorOverride, size, trailLength, spreadAngle, fanDirection, rotateParticles
    } = props;

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotate = useSharedValue(0);
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0);

    const particleProps = useMemo(
        () => getParticleProps({
            index, particleCount, duration, shapes, colors, explosionForce, direction, burst,
            gravityOverride: gravity, singleColor, colorOverride, size, spreadAngle, fanDirection, rotateParticles
        }),
        [index, particleCount, duration, shapes, colors, explosionForce, direction, burst, gravity, singleColor, colorOverride, size, spreadAngle, fanDirection, rotateParticles]
    );

    useEffect(() => {
        if (show) {
            const getNumericProp = (value, defaultValue = 0) => (typeof value === 'number' && !isNaN(value)) ? value : defaultValue;
            translateX.value = getNumericProp(particleProps.startOffsetX);
            translateY.value = getNumericProp(particleProps.startOffsetY);
            rotate.value = 0;
            opacity.value = 0;
            scale.value = 0;
            const startAnimation = () => {
                if (!particleProps) return;
                const pDuration = getNumericProp(particleProps.particleDuration, duration);
                const animationDuration = pDuration > 0 ? pDuration : duration;
                const timeSeconds = animationDuration / 1000.0;
                const pGravity = getNumericProp(particleProps.gravity);
                const pInitialVelX = getNumericProp(particleProps.initialVelX);
                const pInitialVelY = getNumericProp(particleProps.initialVelY);
                const currentStartX = translateX.value;
                const currentStartY = translateY.value;
                const pRotationSpeed = getNumericProp(particleProps.rotationSpeed, (Math.random() - 0.5) * 720);
                const finalX = currentStartX + pInitialVelX * timeSeconds;
                const finalY = currentStartY + pInitialVelY * timeSeconds + 0.5 * pGravity * Math.pow(timeSeconds, 2);
                if (isNaN(finalX) || isNaN(finalY) || isNaN(animationDuration) || animationDuration <= 0) {
                    opacity.value = withTiming(0, { duration: 100 });
                    scale.value = withTiming(0, { duration: 100 });
                    return;
                }
                scale.value = withSequence(
                    withTiming(1.2 + Math.random() * 0.6, { duration: 60 + Math.random() * 50, easing: Easing.out(Easing.cubic) }),
                    withDelay(animationDuration * 0.3, withTiming(0, { duration: animationDuration * 0.6, easing: Easing.in(Easing.quad) }))
                );
                opacity.value = withSequence(
                    withTiming(0.9 + Math.random() * 0.1, { duration: 20 + Math.random() * 20, easing: Easing.linear }),
                    withDelay(animationDuration * 0.15, withTiming(0, { duration: animationDuration * 0.75, easing: Easing.in(Easing.cubic) }))
                );
                translateX.value = withTiming(finalX, { duration: animationDuration, easing: Easing.out(Easing.quad) });
                translateY.value = withTiming(finalY, { duration: animationDuration, easing: Easing.in(Easing.quad) });
                rotate.value = withTiming(pRotationSpeed * timeSeconds, { duration: animationDuration, easing: Easing.linear });
            };
            if (particleProps.delay > 0) {
                const timer = setTimeout(startAnimation, particleProps.delay);
                return () => clearTimeout(timer);
            } else startAnimation();
        } else {
            opacity.value = withTiming(0, { duration: 150 });
            scale.value = withTiming(0, { duration: 150 });
        }
    }, [show, particleProps, duration]);

    // Memoize the shape style so it's available on the JS thread
    const shapeStyle = useMemo(() => {
        const isStar = particleProps.shape === 'star';
        const isRect = particleProps.shape === 'rect';
        const shapeSize = isStar ? particleProps.size * 1.6 : particleProps.size;
        if (isRect) {
            return {
                width: shapeSize * 2.2,
                height: shapeSize * 0.5,
                backgroundColor: particleProps.color,
                borderRadius: 2,
            };
        }
        const baseStyle = { width: shapeSize, height: shapeSize, backgroundColor: particleProps.color };
        switch (particleProps.shape) {
            case 'circle':
                return { ...baseStyle, borderRadius: shapeSize / 2 };
            case 'triangle':
                return {
                    ...baseStyle,
                    backgroundColor: 'transparent',
                    borderLeftWidth: shapeSize / 2,
                    borderRightWidth: shapeSize / 2,
                    borderBottomWidth: shapeSize,
                    borderLeftColor: 'transparent',
                    borderRightColor: 'transparent',
                    borderBottomColor: particleProps.color,
                    width: 0,
                    height: 0
                };
            case 'star':
                return { width: shapeSize, height: shapeSize, backgroundColor: 'transparent' };
            default:
                return { ...baseStyle, borderRadius: shapeSize / 5 };
        }
    }, [particleProps.shape, particleProps.size, particleProps.color]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            position: 'absolute',
            left: 0,
            top: 0,
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { rotate: `${rotate.value}deg` },
                { scale: scale.value }
            ],
            opacity: opacity.value,
            // Spread the memoized shape style here
            ...shapeStyle,
        };
    });

    // Trail: render faded copies behind the main particle
    const renderTrail = () => {
        if (!props.trail) return null;
        const trailEls = [];
        for (let i = 1; i <= trailLength; i++) {
            const t = i / (trailLength + 1);
            // Use the same shapeStyle for the trail
            const trailStyle = useAnimatedStyle(() => {
                return {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    transform: [
                        { translateX: translateX.value * (1 - t) },
                        { translateY: translateY.value * (1 - t) },
                        { rotate: `${rotate.value * (1 - t)}deg` },
                        { scale: scale.value * (1 - t * 0.3) }
                    ],
                    opacity: opacity.value * (0.2 * (1 - t) + 0.05),
                    ...shapeStyle,
                };
            });
            if (particleProps.shape === 'star') {
                const starSize = particleProps.size * 1.6;
                trailEls.push(
                    <Animated.View key={i} style={trailStyle}>
                        <Svg
                            width={starSize}
                            height={starSize}
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <Path
                                d="M12 2.5l3.09 6.26 6.91.99-5 4.87 1.18 6.88L12 17.77l-6.18 3.23L7 14.62l-5-4.87 6.91-.99L12 2.5z"
                                stroke={particleProps.color}
                                strokeWidth={1.5}
                                fill="none"
                            />
                        </Svg>
                    </Animated.View>
                );
            } else {
                trailEls.push(<Animated.View key={i} style={trailStyle} />);
            }
        }
        return trailEls;
    };

    if (particleProps.shape === 'star') {
        const starSize = particleProps.size * 1.6;
        return (
            <>
                {renderTrail()}
                <Animated.View style={animatedStyle}>
                    <Svg
                        width={starSize}
                        height={starSize}
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <Path
                            d="M12 2.5l3.09 6.26 6.91.99-5 4.87 1.18 6.88L12 17.77l-6.18 3.23L7 14.62l-5-4.87 6.91-.99L12 2.5z"
                            stroke={particleProps.color}
                            strokeWidth={1.5}
                            fill="none"
                        />
                    </Svg>
                </Animated.View>
            </>
        );
    }

    return (
        <>
            {renderTrail()}
            <Animated.View style={animatedStyle} />
        </>
    );
};

const Sparkles = ({
                      show,
                      location,
                      onComplete,
                      particleCount = 50,
                      duration = 800,
                      shapes = DEFAULT_SHAPES,
                      colors = DEFAULT_COLORS,
                      explosionForce = DEFAULT_EXPLOSION_FORCE,
                      direction = 'radial',
                      trail = false,
                      burst = false,
                      gravity,
                      singleColor = false,
                      size = { min: 6, max: 12 },
                      trailLength = 4,
                      spreadAngle = 120,
                      fanDirection = -90,
                      rotateParticles = true,
                  }) => {
    // Always pick a new color for each burst if singleColor is true and show is true
    const colorOverride = useMemo(() => {
        if (singleColor && show && colors.length > 0) {
            return colors[Math.floor(Math.random() * colors.length)];
        }
        return undefined;
    }, [show, singleColor, colors]);

    const particles = useMemo(() => Array.from({ length: particleCount }, (_, i) => i), [particleCount]);

    useEffect(() => {
        if (show && onComplete) {
            const timer = setTimeout(onComplete, duration + 500);
            return () => clearTimeout(timer);
        }
    }, [show, onComplete, duration]);

    const containerStyle = useMemo(() => ({
        top: location.y,
        left: location.x,
    }), [location]);

    if (!show) return null;

    return (
        <View style={[styles.container, containerStyle]}>
            {particles.map((index) => (
                <SparkleParticle
                    key={`sparkle-${index}`}
                    index={index}
                    show={show}
                    particleCount={particleCount}
                    duration={duration}
                    shapes={shapes}
                    colors={colors}
                    explosionForce={explosionForce}
                    direction={direction}
                    trail={trail}
                    burst={burst}
                    gravity={gravity}
                    singleColor={singleColor}
                    colorOverride={colorOverride}
                    size={size}
                    trailLength={trailLength}
                    spreadAngle={spreadAngle}
                    fanDirection={fanDirection}
                    rotateParticles={rotateParticles}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: 1,
        height: 1,
        pointerEvents: 'none',
        zIndex: 100,
        overflow: 'visible',
    },
});

export default Sparkles;
