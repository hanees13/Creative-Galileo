import React, {useEffect} from 'react';
import {View, Image} from 'react-native';

import {ScaledSheet} from 'react-native-size-matters';
import {BounceView} from '../components/BounceView';
import global from '../../global';
import {useNavigation} from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{name: 'HomeScreen'}],
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <BounceView>
        <Image source={global.ASSETS.SPLASH_LOGO} style={styles.imageStyle} />
      </BounceView>
    </View>
  );
};

export default SplashScreen;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: global.COLOR.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: '220@s',
    height: '168.5@s',
  },
});
