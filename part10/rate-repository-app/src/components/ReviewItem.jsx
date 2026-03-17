import { View, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import Text from './Text';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.repositoryItemBackground,
    padding: 15,
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
  username: {
    marginBottom: 5,
  },
  date: {
    marginBottom: 5,
  },
  reviewText: {
    lineHeight: 20,
  },
});

const ReviewItem = ({ review }) => {
  const formattedDate = format(new Date(review.createdAt), 'dd.MM.yyyy');

  return (
    <View style={styles.container}>
      <View style={styles.ratingCircle}>
        <Text style={styles.ratingText}>{review.rating}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text fontWeight="bold" fontSize="subheading" style={styles.username}>
          {review.user.username}
        </Text>
        <Text color="textSecondary" style={styles.date}>
          {formattedDate}
        </Text>
        {review.text && <Text style={styles.reviewText}>{review.text}</Text>}
      </View>
    </View>
  );
};

export default ReviewItem;
