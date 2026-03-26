export const formatResponse = (success: boolean, message: string, data?: any) => {
  return { success, message, data };
};

export const paginate = (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
};

export const isValidScore = (score: number) => {
  return score >= 0 && score <= 10;
};