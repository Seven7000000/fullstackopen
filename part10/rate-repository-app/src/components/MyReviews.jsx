import { FlatList, View, StyleSheet, Pressable, Alert } from 'react-native';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-native';
import { format } from 'date-fns';

import Text from './Text';
import { ME } from '../graphql/queries';
import useDeleteReview from '../hooks/useDeleteReview';
import theme from '../theme';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  reviewContainer: {
    backgroundColor: theme.colors.repositoryItemBackground,
    padding: 15,
  },
  topRow: {
    flexDirection: 'row',
  },
  ratingCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: theme.colors.ratingCircle,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  ratingText: {
    color: theme.colors.ratingCircle,
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.subheading,
  },
  contentContainer: {
    flex: 1,
  },
  repoName: {
    marginBottom: 5,
  },
  date: {
    marginBottom: 5,
  },
  reviewText: {
    lineHeight: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  viewButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: theme.colors.deleteButton,
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.white,
    fontWeight: theme.fontWeights.bold,
  },
  loading: {
    padding: 20,
    alignItems: 'center',
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const MyReviewItem = ({ review, onDelete, onViewRepository }) => {
  const formattedDate = format(new Date(review.createdAt), 'dd.MM.yyyy');

  return (
    <View style={styles.reviewContainer}>
      <View style={styles.topRow}>
        <View style={styles.ratingCircle}>
          <Text style={styles.ratingText}>{review.rating}</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text fontWeight="bold" fontSize="subheading" style={styles.repoName}>
            {review.repository.fullName}
          </Text>
          <Text color="textSecondary" style={styles.date}>
            {formattedDate}
          </Text>
          {review.text && (
            <Text style={styles.reviewText}>{review.text}</Text>
          )}
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <Pressable
          style={styles.viewButton}
          onPress={() => onViewRepository(review.repositoryId)}
        >
          <Text style={styles.buttonText}>View repository</Text>
        </Pressable>
        <Pressable
          style={styles.deleteButton}
          onPress={() => onDelete(review.id)}
        >
          <Text style={styles.buttonText}>Delete review</Text>
        </Pressable>
      </View>
    </View>
  );
};

const MyReviews = () => {
  const { data, loading, refetch } = useQuery(ME, {
    variables: { includeReviews: true },
    fetchPolicy: 'cache-and-network',
  });
  const [deleteReview] = useDeleteReview();
  const navigate = useNavigate();

  if (loading && !data) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const reviews = data?.me?.reviews
    ? data.me.reviews.edges.map((edge) => edge.node)
    : [];

  const handleDelete = (id) => {
    Alert.alert(
      'Delete review',
      'Are you sure you want to delete this review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteReview(id);
              refetch();
            } catch (e) {
              console.log(e);
            }
          },
        },
      ]
    );
  };

  const handleViewRepository = (repositoryId) => {
    navigate(`/repository/${repositoryId}`);
  };

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => (
        <MyReviewItem
          review={item}
          onDelete={handleDelete}
          onViewRepository={handleViewRepository}
        />
      )}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={ItemSeparator}
    />
  );
};

export default MyReviews;
