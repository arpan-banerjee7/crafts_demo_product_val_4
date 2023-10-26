const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3004;

// Middleware to parse JSON in the request body
app.use(bodyParser.json());

app.post("/user/validate", (req, res) => {
  // Get the user data from the request body
  const userData = req.body;
  const productId = req.header("productId");
  console.log("Validation service 4 called");
  // Ensure 'userId' is included in the response
  if (!userData.userId) {
    return res
      .status(400)
      .json({ error: "User ID is missing in the request." });
  }

  if (!productId) {
    return res
      .status(400)
      .json({ error: "Product ID is missing in the request." });
  }

  // Define validation rules for fields
  const validationRules = {
    legalName: {
      validate: (value) => value && value.trim() !== "",
      errorMessage: "Legal name should not be empty.",
    },
    website: {
      validate: (value) => value && value.trim() !== "",
      errorMessage: "Website should not be empty.",
    },
    "businessAddress.line1": {
      validate: (value) => value && value.trim() !== "",
      errorMessage: "Business address line1 should not be empty.",
    },
    "businessAddress.city": {
      validate: (value) => value && value.trim() !== "",
      errorMessage: "Business address city should not be empty.",
    },
    "businessAddress.state": {
      validate: (value) => value && value.trim() !== "",
      errorMessage: "Business address state should not be empty.",
    },
    "businessAddress.country": {
      validate: (value) => value && value.trim() !== "",
      errorMessage: "Business address country should not be empty.",
    },
  };

  const validationErrors = [];

  // Check each field based on the validation rules
  for (const fieldPath in validationRules) {
    if (getFieldByPath(userData, fieldPath)) {
      const fieldValidation = validationRules[fieldPath];
      const field = getFieldByPath(userData, fieldPath);

      if (!fieldValidation.validate(field)) {
        validationErrors.push(fieldValidation.errorMessage);
      }
    }
  }

  if (validationErrors.length > 0) {
    return res.status(400).json({
      errors: validationErrors,
      userId: userData.userId,
      productId: productId,
    });
  }

  res.json({
    message: "User data is valid.",
    userId: userData.userId,
    productId: productId,
  });
});

// Helper function to get a nested field by path
function getFieldByPath(obj, path) {
  const parts = path.split(".");
  let value = obj;
  for (const part of parts) {
    if (value && value.hasOwnProperty(part)) {
      value = value[part];
    } else {
      return undefined; // Property does not exist
    }
  }
  return value;
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
