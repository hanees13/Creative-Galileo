import React, {useRef, useEffect} from 'react';
import {Animated, Easing} from 'react-native';

export const BounceView = props => {
  const bounceAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(bounceAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
      easing: Easing.bounce,
    }).start();
  }, [bounceAnim]);

  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        opacity: 1,
        transform: [{scale: bounceAnim}],
      }}>
      {props.children}
    </Animated.View>
  );
};
