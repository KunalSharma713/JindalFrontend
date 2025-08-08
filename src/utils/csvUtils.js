import Papa from 'papaparse';

export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (err) => reject(err),
    });
  });
};

export const validateRow = (row, columnDefinitions) => {
  const errors = [];

  columnDefinitions.forEach((col) => {
    const { key, label, type, required, validator, errorMessage } = col;
    const value = row[key];

    const isEmpty = value === undefined || value === null || String(value).trim() === "";

    // ✅ Required check
    if (required && isEmpty) {
      errors.push(`${label} is required.`);
      return;
    }

    // ✅ Skip optional empty
    if (!required && isEmpty) return;

    // ✅ Field-specific and type validations
    switch (type) {
      case "username":
        // Allow only letters (a-z, A-Z) and numbers (0-9)
        if (!/^[a-zA-Z0-9]+$/.test(value)) {
          errors.push("Username can only contain letters and numbers.");
        }
        break;

      case "name":
        if (/^\d/.test(value)) {
          errors.push(`${label} cannot start with a number.`);
        } else if (!/^[a-zA-Z\s-]+$/.test(value)) {
          errors.push(`${label} can only contain letters, spaces, or hyphens.`);
        }
        break;

      case "email":
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          errors.push("Invalid Email Format!");
        }
        break;

      case "mobile_number":
        if (!/^[0-9]{10}$/.test(value)) {
          errors.push("Invalid Phone Number! It must be exactly 10 digits.");
        }
        break;

      case "password":
        if (value.length < 6) {
          errors.push("Password must be at least 6 characters long!");
        }
        if (!/[A-Z]/.test(value)) {
          errors.push("Password must contain at least one uppercase letter!");
        }
        if (!/[a-z]/.test(value)) {
          errors.push("Password must contain at least one lowercase letter!");
        }
        if (!/[0-9]/.test(value)) {
          errors.push("Password must contain at least one number!");
        }
        if (!/[!@#$%^&*(),.?\":{}|<>]/.test(value)) {
          errors.push("Password must contain at least one special character!");
        }
        break;
    }

    // ✅ General type-based validation
    switch (type) {
      case "string":
        if (typeof value !== "string" || value.trim() === "") {
          errors.push(errorMessage || `${label} must be a valid string.`);
        }
        break;
      case "number":
        if (isNaN(value)) {
          errors.push(errorMessage || `${label} must be a number.`);
        }
        break;
      case "link":
        if (!/^https?:\/\/\S+\.\S+/.test(value)) {
          errors.push(errorMessage || `${label} must be a valid URL.`);
        }
        break;
      case "custom":
        if (validator && !validator(value)) {
          errors.push(errorMessage || `${label} failed custom validation.`);
        }
        break;
    }
  });

  return errors;
};

export const validateCSVData = (data, columnDefinitions) => {
  return data.map((row) => ({
    ...row,
    _rowErrors: validateRow(row, columnDefinitions),
  }));
};
