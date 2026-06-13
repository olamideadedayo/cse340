import bcrypt from 'bcrypt';
import { createUser, authenticateUser } from '../models/users.js';

// ==========================================
// REGISTRATION CONTROLLER FUNCTIONS
// ==========================================

/**
 * Middleware factory to require a specific role for route access
 * Returns middleware that checks if user has the required role
 * * @param {string} role - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
export const requireRole = (role) => {
    return (req, res, next) => {
        // Check if user is logged in first
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // Check if user's role matches the required role
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        // User has the required role, continue to the controller
        next();
    };
};


export const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

export const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the user in the database
        await createUser(name, email, passwordHash);

        // Redirect to the home page after successful registration
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

// ==========================================
// LOGIN, LOGOUT & MIDDLEWARE FUNCTIONS
// ==========================================

// 1. Render the Login Form view
export const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

// 2. Process Login Form Submission
export const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        if (user) {
            // Store user info in session
            req.session.user = user;
            req.flash('success', 'Login successful!');

            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }

            // Redirects straight to the protected dashboard
            res.redirect('/dashboard');
        } else {
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

// 3. Process Logout Request
export const processLogout = async (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session during logout:', err);
            }
            res.redirect('/login');
        });
    } else {
        res.redirect('/login');
    }
};

// 4. Route Protection Middleware Bouncer
export const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next(); // User exists on the session, move forward safely!
};

// 5. Add the Dashboard View Controller
export const showDashboard = (req, res) => {
    const user = req.session.user;
    res.render('dashboard', { 
        title: 'Dashboard',
        name: user.name,
        email: user.email
    });
};
