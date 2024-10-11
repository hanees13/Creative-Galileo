import {TextInput, View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';

import global from '../../global';
import {ScaledSheet} from 'react-native-size-matters';

const SearchBarComponent = props => {
  console.log(props.searchQuery);
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        placeholderTextColor={global.COLOR.WHITE}
        value={props.searchQuery}
        onChangeText={props.onSearch}
      />
      {props.searchQuery ? (
        <TouchableOpacity
          onPress={props.handleResetSearch}
          style={styles.resetContainer}>
          <Text style={styles.resetText}>X</Text>
        </TouchableOpacity>
      ) : null}
      <View style={styles.searchContainer}>
        <Image source={global.ASSETS.SEARCH_ICON} style={styles.searchIcon} />
      </View>
    </View>
  );
};

export default SearchBarComponent;

const styles = ScaledSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',

    borderRadius: '22.5@s',
    height: '45@s',
    paddingLeft: 10,
    paddingRight: 2,
    backgroundColor: '#DADADA',
    marginHorizontal: '10@s',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: '10@s',
    fontFamily: global.FONT.REGULAR,
    fontWeight: '400',
    fontSize: '13@s',
    color: global.COLOR.BLACK,
  },
  searchIcon: {
    height: '24@s',
    width: '24@s',
  },
  searchContainer: {
    backgroundColor: global.COLOR.WHITE,
    borderRadius: '20@s',

    height: '40@s',
    width: '40@s',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetContainer: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: global.COLOR.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: global.FONT.BOLD,
    color: global.COLOR.BLACK_TITLE,
  },
});
