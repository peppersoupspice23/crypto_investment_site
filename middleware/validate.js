export default function validate(requiredFields = []) {
  return (req, res, next) => {
    const missing = requiredFields.filter(field => !req.body[field]);

    if (missing.length > 0) {
      return res.status(400).json({
        error: `Missing required field${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`
      });
    }

    next();
  };
}
