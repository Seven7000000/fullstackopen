export const calculateBmi = (height: number, weight: number): string => {
  if (height === 0) throw new Error('Height cannot be zero');

  const bmi = weight / ((height / 100) ** 2);

  if (bmi < 16) return 'Underweight (Severe thinness)';
  if (bmi < 17) return 'Underweight (Moderate thinness)';
  if (bmi < 18.5) return 'Underweight (Mild thinness)';
  if (bmi < 25) return 'Normal range';
  if (bmi < 30) return 'Overweight (Pre-obese)';
  if (bmi < 35) return 'Obese (Class I)';
  if (bmi < 40) return 'Obese (Class II)';
  return 'Obese (Class III)';
};

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.log('Usage: ts-node bmiCalculator.ts <height> <weight>');
    process.exit(1);
  }

  const height = Number(args[0]);
  const weight = Number(args[1]);

  if (isNaN(height) || isNaN(weight)) {
    console.log('Error: provided values were not numbers');
    process.exit(1);
  }

  console.log(calculateBmi(height, weight));
}
