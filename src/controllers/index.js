// src/controllers/index.js

// Define the controller function for the home page
const showHomePage = async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
};

// Export the controller function
export { showHomePage };
