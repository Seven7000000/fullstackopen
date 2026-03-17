import { useState } from 'react';
import { FlatList, View, StyleSheet, Pressable } from 'react-native';
import { useNavigate } from 'react-router-native';
import { Picker } from '@react-native-picker/picker';
import { useDebounce } from 'use-debounce';

import RepositoryItem from './RepositoryItem';
import TextInput from './TextInput';
import useRepositories from '../hooks/useRepositories';
import theme from '../theme';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  container: {
    flex: 1,
  },
  searchInput: {
    margin: 15,
    marginBottom: 0,
  },
  pickerContainer: {
    marginHorizontal: 15,
    marginVertical: 10,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const OrderPicker = ({ selectedOrder, setSelectedOrder }) => {
  return (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedOrder}
        onValueChange={(itemValue) => setSelectedOrder(itemValue)}
      >
        <Picker.Item label="Latest repositories" value="latest" />
        <Picker.Item label="Highest rated repositories" value="highestRated" />
        <Picker.Item label="Lowest rated repositories" value="lowestRated" />
      </Picker>
    </View>
  );
};

const getOrderVariables = (selectedOrder) => {
  switch (selectedOrder) {
    case 'highestRated':
      return { orderBy: 'RATING_AVERAGE', orderDirection: 'DESC' };
    case 'lowestRated':
      return { orderBy: 'RATING_AVERAGE', orderDirection: 'ASC' };
    case 'latest':
    default:
      return { orderBy: 'CREATED_AT', orderDirection: 'DESC' };
  }
};

export const RepositoryListContainer = ({
  repositories,
  onEndReach,
  selectedOrder,
  setSelectedOrder,
  searchKeyword,
  setSearchKeyword,
  navigate,
}) => {
  const repositoryNodes = repositories
    ? repositories.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={
        <View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search repositories..."
            value={searchKeyword}
            onChangeText={setSearchKeyword}
          />
          <OrderPicker
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
          />
        </View>
      }
      renderItem={({ item }) => (
        <Pressable onPress={() => navigate(`/repository/${item.id}`)}>
          <RepositoryItem item={item} />
        </Pressable>
      )}
      keyExtractor={(item) => item.id}
      onEndReached={onEndReach}
      onEndReachedThreshold={0.5}
      style={styles.container}
    />
  );
};

const RepositoryList = () => {
  const [selectedOrder, setSelectedOrder] = useState('latest');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedSearchKeyword] = useDebounce(searchKeyword, 500);
  const navigate = useNavigate();

  const orderVariables = getOrderVariables(selectedOrder);

  const { repositories, fetchMore } = useRepositories({
    ...orderVariables,
    searchKeyword: debouncedSearchKeyword,
    first: 8,
  });

  const onEndReach = () => {
    fetchMore();
  };

  return (
    <RepositoryListContainer
      repositories={repositories}
      onEndReach={onEndReach}
      selectedOrder={selectedOrder}
      setSelectedOrder={setSelectedOrder}
      searchKeyword={searchKeyword}
      setSearchKeyword={setSearchKeyword}
      navigate={navigate}
    />
  );
};

export default RepositoryList;
