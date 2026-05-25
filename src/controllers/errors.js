// src/controllers/errors.js

// Define the controller function
const testErrorPage = (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
};

// Export the controller function
export { testErrorPage };
