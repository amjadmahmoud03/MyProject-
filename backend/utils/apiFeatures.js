class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['sort', 'fields', 'page', 'limit'];
    excludedFields.forEach((el) => delete queryObj[el]);

    const mongoQuery = {};
    Object.entries(queryObj).forEach(([key, value]) => {
      if (key.includes('[') && key.endsWith(']')) {
        const [field, op] = key.split('[');
        const operator = `$${op.replace(']', '')}`;
        if (!mongoQuery[field]) mongoQuery[field] = {};
        mongoQuery[field][operator] = Number(value);
      } else {
        // eslint-disable-next-line no-restricted-globals
        mongoQuery[key] = isNaN(value) ? value : Number(value);
      }
    });

    this.query = this.query.find(mongoQuery);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAd');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 20;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
