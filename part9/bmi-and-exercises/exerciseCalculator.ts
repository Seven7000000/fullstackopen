interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (
  dailyHours: number[],
  target: number
): ExerciseResult => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter((d) => d > 0).length;
  const average = dailyHours.reduce((a, b) => a + b, 0) / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  const ratio = average / target;

  if (ratio >= 1) {
    rating = 3;
    ratingDescription = 'excellent, you met your target';
  } else if (ratio >= 0.75) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  } else {
    rating = 1;
    ratingDescription = 'you need to exercise more';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log(
      'Usage: ts-node exerciseCalculator.ts <target> <day1> <day2> ...'
    );
    process.exit(1);
  }

  const target = Number(args[0]);
  const dailyHours = args.slice(1).map(Number);

  if (isNaN(target) || dailyHours.some(isNaN)) {
    console.log('Error: provided values were not numbers');
    process.exit(1);
  }

  console.log(calculateExercises(dailyHours, target));
}
