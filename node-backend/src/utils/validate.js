const validate = (fields) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value || value.toString().trim() === "") {
      return `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
    }
  }
  return null;
};

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

module.exports = {
  validate,
  validateEmail,
};
