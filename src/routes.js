import { Router } from 'express'; // 👈 Explicitly pull Router from express
import express from 'express';

// Controller Imports
import { showHomePage } from './controllers/index.js';
import { testErrorPage } from './controllers/errors.js';
import { getCategoryDetails } from './controllers/category.js';
import { 
    showUserRegistrationForm, 
    processUserRegistrationForm, 
    showLoginForm, 
    processLoginForm, 
    processLogout,
    requireLogin,   
    showDashboard,
    requireRole // 👈 Added requireRole to the import list
} from './controllers/users.js';

import { 
    showOrganizationsPage, 
    showOrganizationDetailsPage, 
    showNewOrganizationForm, 
    processNewOrganizationForm, 
    organizationValidation, 
    showEditOrganizationForm, 
    processEditOrganizationForm 
} from './controllers/organizations.js';
import { 
    showProjectsPage, 
    showProjectDetailsPage, 
    showNewProjectForm, 
    processNewProjectForm, 
    projectValidation, 
    showEditProjectForm, 
    processEditProjectForm 
} from './controllers/projects.js';
import { 
    showCategoriesPage, 
    showAssignCategoriesForm, 
    processAssignCategoriesForm, 
    showNewCategoryForm, 
    processNewCategoryForm, 
    showEditCategoryForm, 
    processEditCategoryForm, 
    categoryValidation 
} from './controllers/categories.js';

const router = express.Router();

// =========================================================================
// 1. STATIC / SPECIFIC ROUTES (Checked First)
// =========================================================================

// Home Route
router.get('/', showHomePage);

// User Registration Routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// User Login & Logout Routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Main Directory Pages (Public View)
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// Resource Creation Forms (GET) & Processing (POST) 🔒 PROTECTED ADMIN-ONLY
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);

router.get('/new-project', requireRole('admin'), showNewProjectForm);
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);

router.get('/new-category', requireRole('admin'), showNewCategoryForm);
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategoryForm);

// Utilities & System Diagnostics
router.get('/test-error', testErrorPage);


// =========================================================================
// 2. DYNAMIC / PARAMETER-DRIVEN ROUTES (Checked Last)
// =========================================================================

// Project-specific Categories Assignment 🔒 PROTECTED ADMIN-ONLY
router.get('/project/:projectId/assign-categories', requireRole('admin'), showAssignCategoriesForm);
router.post('/project/:projectId/assign-categories', requireRole('admin'), processAssignCategoriesForm);

// Edit Forms (GET) & Processing (POST) 🔒 PROTECTED ADMIN-ONLY
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);

router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), processEditProjectForm);

router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);

// Single Item View Details (Public View)
router.get('/project/:id', showProjectDetailsPage);
router.get('/category/:id', getCategoryDetails);
router.get('/organization/:id', showOrganizationDetailsPage);

// Protected dashboard route (Standard Users & Admins)
router.get('/dashboard', requireLogin, showDashboard);

export default router;