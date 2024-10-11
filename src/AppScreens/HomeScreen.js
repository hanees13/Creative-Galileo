import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {scale, ScaledSheet} from 'react-native-size-matters';
import global from '../../global';
import SearchBarComponent from '../components/SearchBarComponent';
import usePagination from '../Networking/usePagination';
const HomeScreen = () => {
  const {
    data,
    totalResult,
    refreshing,
    loadingMore,
    handleRefresh,
    loadMore,
    initialLoader,
  } = usePagination();
  const [searchQuery, setSearchQuery] = useState('');
  const customerRenderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={() => {}} style={styles.DataListContainer}>
        <Image source={global.ASSETS.USER_IMAGE} style={styles.dp} />
        <View style={styles.customerDetailsContainer}>
          <Text style={styles.name}>Name: {item?.name}</Text>
          <Text style={styles.ItemTextStyle}>Email: {item?.email}</Text>
          <Text style={styles.ItemTextStyle}>CgId: {item?.cgId}</Text>
          <Text style={styles.ItemTextStyle}>
            Mobile: {item?.dialCode + item?.mobile}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  //console.log(data);

  const renderFooter = () => {
    if (!loadingMore || data.length < 8) return null; // Do not show footer loader for the first page
    return <ActivityIndicator animating size="large" color={'#000000'} />;
  };
  const handleSearch = query => {
    setSearchQuery(query);
  };
  const handleResetSearch = () => {
    setSearchQuery('');
  };
  const searchCustomers = query => {
    return data.filter(customer => {
      const nameMatch = customer.name
        ?.toLowerCase()
        .includes(query.toLowerCase());
      const emailMatch = customer.email
        ?.toLowerCase()
        .includes(query.toLowerCase());
      return nameMatch || emailMatch;
    });
  };
  const filteredCustomers = searchQuery ? searchCustomers(searchQuery) : data;
  return (
    <View style={styles.container}>
      <TouchableOpacity
      //  onPress={toggleDrawer}
      >
        <View style={styles.headerContainer}>
          <SearchBarComponent
            searchQuery={searchQuery}
            onSearch={handleSearch}
            handleResetSearch={handleResetSearch}
          />
        </View>
      </TouchableOpacity>
      <FlatList
        scrollEnabled={true}
        data={filteredCustomers}
        renderItem={customerRenderItem}
        keyExtractor={item => item.email}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: scale(50)}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: global.COLOR.WHITE,
  },
  headerContainer: {
    height: '120@s',
    backgroundColor: global.COLOR.WHITE,
    borderBottomLeftRadius: '15@s',
    borderBottomRightRadius: '15@s',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  DataListContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'flex-start',
    width: '90%',
    alignSelf: 'center',
    padding: '10@s',

    marginTop: '15@vs',
    backgroundColor: '#F7F7F7',
    borderRadius: '8@s',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  customerDetailsContainer: {
    alignItems: 'flex-start',
    maxWidth: '70%',
    marginLeft: 10,
  },
  name: {
    fontSize: '14@s',
    fontWeight: '500',
    color: '#1B1E28',
    textAlign: 'center',
    fontFamily: global.FONT.MEDIUM,
  },
  ItemTextStyle: {
    fontSize: '12@s',
    fontWeight: '400',
    color: global.COLOR.MEDIUM_DARK_GRAY,
    textAlign: 'center',
    fontFamily: global.FONT.REGULAR,
  },
  dp: {
    width: '45@s',
    height: '45@s',
    resizeMode: 'contain',
    borderRadius: '40@s',
  },
});

export default HomeScreen;
