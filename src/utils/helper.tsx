export const calculateDifference = (date: string) => {
  const today = new Date();
  const target = new Date(date);
  const differenceInTime = today.getTime() - target.getTime();
  const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));

  if (differenceInDays === 0) return 'Today';
  if (differenceInDays === 1) return '1 day ago';
  if (differenceInDays < 7) return `${differenceInDays} days ago`;
  if (differenceInDays < 30)
    return `${Math.floor(differenceInDays / 7)} weeks ago`;
  if (differenceInDays < 365)
    return `${Math.floor(differenceInDays / 30)} months ago`;
  return `${Math.floor(differenceInDays / 365)} years ago`;
};

export const getAverageRating = (recipeRating: [{ rating: number }]) => {
  let totalRating = 0;
  recipeRating?.map((rating) => {
    totalRating += rating.rating;
  });
  return (totalRating / recipeRating?.length).toFixed(1);
};
