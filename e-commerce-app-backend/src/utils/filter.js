export const buildQuery = (filters = {}) => {
  const query = {};
  if (filters.search) {
    query.$text = { $search: filters.search };
  }
  if (filters.category) {
    query.category = filters.category;
  }
  return query;
};
