function validate(requiredFields = []) {
  return (req, res, next) => {
    const missing = requiredFields.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || String(value).trim() === '';
    });

    if (missing.length) {
      return res.status(400).json({
        message: `Missing required fields: ${missing.join(', ')}`
      });
    }

    return next();
  };
}

module.exports = validate;
