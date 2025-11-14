// Validate phone number (Nigerian format: 080XXXXXXXX, 070..., 090...)
export function validatePhone(phone) {
  const phoneRegex = /^(080|081|070|090)\d{8}$/;
  return phoneRegex.test(phone);
}

// Validate price submission data
export function validatePriceSubmission(data) {
  const errors = {};
  if (!data.commodityId) errors.commodityId = "Commodity is required";
  if (!data.marketId) errors.marketId = "Market is required";
  if (!data.price || data.price <= 1000) errors.price = "Price must be greater than ₦1,000";
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Validate user registration data
export function validateRegistration(data) {
  const errors = {};
  if (!data.fullName || data.fullName.trim().length < 3) errors.fullName = "Full name must be at least 3 characters";
  if (!validatePhone(data.phone)) errors.phone = "Invalid Nigerian phone number";
  if (!data.password || data.password.length < 6) errors.password = "Password must be at least 6 characters";
  if (data.password !== data.confirmPassword) errors.confirmPassword = "Passwords do not match";
  if (!data.role) errors.role = "User role is required";
  if (!data.state) errors.state = "State is required";
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Validate login credentials
export function validateLogin(phone, password) {
  const errors = {};
  if (!validatePhone(phone)) errors.phone = "Invalid Nigerian phone number";
  if (!password) errors.password = "Password is required";
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
