import { FlatList, View, StyleSheet, Pressable } from 'react-native';
import { useParams } from 'react-router-native';
import * as Linking from 'expo-linking';

import RepositoryItem from './RepositoryItem';
import ReviewItem from './ReviewItem';
import Text from './Text';
import useRepository from '../hooks/useRepository';
import theme from '../theme';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    margin: 15,
    marginTop: 0,
  },
  buttonText: {
    color: theme.colors.white,
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.subheading,
  },
  headerContainer: {
    backgroundColor: theme.colors.repositoryItemBackground,
    marginBottom: 10,
  },
  loading: {
    padding: 20,
    alignItems: 'center',
  },
});

const RepositoryInfo = ({ repository }) => {
  const openGitHub = () => {
    Linking.openURL(repository.url);
  };

  return (
    <View style={styles.headerContainer}>
      <RepositoryItem item={repository} />
      <Pressable style={styles.button} onPress={openGitHub}>
        <Text style={styles.buttonText}>Open in GitHub</Text>
      </Pressable>
    </View>
  );
};

const ItemSeparator = () => <View style={styles.separator} />;

const SingleRepository = () => {
  const { id } = useParams();
  const { repository, loading, fetchMore } = useRepository(id);

  if (loading && !repository) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!repository) return null;

  const reviews = repository.reviews
    ? repository.reviews.edges.map((edge) => edge.node)
    : [];

  const onEndReach = () => {
    fetchMore();
  };

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={() => <RepositoryInfo repository={repository} />}
      ItemSeparatorComponent={ItemSeparator}
      onEndReached={onEndReach}
      onEndReachedThreshold={0.5}
    />
  );
};

export default SingleRepository;
