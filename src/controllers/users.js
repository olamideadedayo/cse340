import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getAllUsersWithRoles } from '../models/users.js';
import { getProjectsByVolunteer } from '../models/volunteers.js';

// ==========================================
// REGISTRATION CONTROLLER FUNCTIONS
// ==========================================

/**
 * Middleware factory to require a specific role for route access
 * Returns middleware that checks if user has the required role
 * @param {string} role - The role name required (e.g., 'admin', 'user')
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
        
        // 🔍 DEBUG LOG 1: What did the database return?
        console.log('--- AUTHENTICATE USER RESULT ---', user);

        if (user) {
            req.session.user = user;
            
            // 🔍 DEBUG LOG 2: Is it successfully inside the session right now?
            console.log('--- SESSION USER SET TO ---', req.session.user);

            req.flash('success', 'Login successful!');
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
export const showDashboard = async (req, res) => {
    const user = req.session.user;
    
    // 🔍 TEMPORARY DEBUG LOG 3
    console.log("--- CURRENT DASHBOARD USER SESSION ---", user);

    try {
        // Fetch projects the logged-in user has signed up for
        const volunteeredProjects = await getProjectsByVolunteer(user.user_id);

        res.render('dashboard', {
            title: 'Dashboard',
            name: user.name,
            email: user.email,
            user,
            volunteeredProjects // 👈 Passed down to loop over in your EJS view
        });
    } catch (error) {
        console.error('Error fetching dashboard projects:', error);
        req.flash('error', 'Could not retrieve your volunteered projects list.');
        res.render('dashboard', {
            title: 'Dashboard',
            name: user.name,
            email: user.email,
            user,
            volunteeredProjects: [] // Fallback to avoid breaking the view on error
        });
    }
};
// ==========================================
// ADMINISTRATIVE FUNCTIONS
// ==========================================

/**
 * Display the Admin-only Users Management Directory
 */
export const showUsersManagementPage = async (req, res, next) => {
    try {
        const systemUsers = await getAllUsersWithRoles();
        
        res.render('users/management', {
            title: 'Manage System Users',
            usersList: systemUsers
        });
    } catch (error) {
        console.error('Error rendering users management directory:', error);
        next(error);
    }
};
