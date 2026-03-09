/**
 * Validation helper functions
 */

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateDPI = (dpi) => {
  // Guatemala DPI format: 13 digits
  const dpiRegex = /^\d{13}$/;
  return dpiRegex.test(dpi);
};

const validateCardNumber = (cardNumber) => {
  const cardRegex = /^\d{16}$/;
  return cardRegex.test(cardNumber);
};

const validateRequired = (value, fieldName) => {
  if (value === undefined || value === null || value === '') {
    return `${fieldName} is required`;
  }
  return null;
};

const validateClient = (data) => {
  const errors = [];
  
  const firstNameError = validateRequired(data.firstName, 'First name');
  if (firstNameError) errors.push(firstNameError);
  
  const lastNameError = validateRequired(data.lastName, 'Last name');
  if (lastNameError) errors.push(lastNameError);
  
  const emailError = validateRequired(data.email, 'Email');
  if (emailError) {
    errors.push(emailError);
  } else if (!validateEmail(data.email)) {
    errors.push('Invalid email format');
  }
  
  const dpiError = validateRequired(data.dpi, 'DPI');
  if (dpiError) {
    errors.push(dpiError);
  } else if (!validateDPI(data.dpi)) {
    errors.push('DPI must be 13 digits');
  }
  
  return errors;
};

const validateAccount = (data) => {
  const errors = [];
  
  const clientIdError = validateRequired(data.clientId, 'Client ID');
  if (clientIdError) errors.push(clientIdError);
  
  const cardNumberError = validateRequired(data.cardNumber, 'Card number');
  if (cardNumberError) {
    errors.push(cardNumberError);
  } else if (!validateCardNumber(data.cardNumber)) {
    errors.push('Card number must be 16 digits');
  }
  
  const holderNameError = validateRequired(data.holderName, 'Holder name');
  if (holderNameError) errors.push(holderNameError);
  
  const expirationError = validateRequired(data.expirationDate, 'Expiration date');
  if (expirationError) errors.push(expirationError);
  
  return errors;
};

const validateTransaction = (data) => {
  const errors = [];
  
  const accountIdError = validateRequired(data.accountId, 'Account ID');
  if (accountIdError) errors.push(accountIdError);
  
  const descriptionError = validateRequired(data.description, 'Description');
  if (descriptionError) errors.push(descriptionError);
  
  const typeError = validateRequired(data.type, 'Type');
  if (typeError) errors.push(typeError);
  
  const amountError = validateRequired(data.amount, 'Amount');
  if (amountError) {
    errors.push(amountError);
  } else if (isNaN(data.amount) || data.amount <= 0) {
    errors.push('Amount must be a positive number');
  }
  
  return errors;
};

module.exports = {
  validateEmail,
  validateDPI,
  validateCardNumber,
  validateRequired,
  validateClient,
  validateAccount,
  validateTransaction
};
