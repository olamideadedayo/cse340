import express from 'express';

import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage } from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';
import { showCategoriesPage } from './controllers/categories.js';
import { getCategoryDetails } from './controllers/category.js'; // Imported from our new controller file
import { testErrorPage } from './controllers/errors.js';
import { showOrganizationDetailsPage } from './controllers/organizations.js';
import { showNewOrganizationForm } from './controllers/organizations.js';
import { processNewOrganizationForm } from './controllers/organizations.js';
import { organizationValidation } from './controllers/organizations.js';
import { showEditOrganizationForm } from './controllers/organizations.js';
import { processEditOrganizationForm } from './controllers/organizations.js';
import { createProject } from './models/projects.js';
import {showNewProjectForm} from './controllers/projects.js';
import { processNewProjectForm } from './controllers/projects.js';
import { projectValidation } from './controllers/projects.js';
import {Route} from 'express';
import { showAssignCategoriesForm, processAssignCategoriesForm } from './controllers/categories.js';
import {showEditProjectForm, processEditProjectForm} from './controllers/projects.js';
import {showNewCategoryForm, processNewCategoryForm, showEditCategoryForm, processEditCategoryForm, categoryValidation} from './controllers/categories.js';
const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/categories', showCategoriesPage);

// Route for specific category detail page
router.get('/category/:id', getCategoryDetails);

// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);

// Error-handling routes
router.get('/test-error', testErrorPage);

// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);

// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// Route to display the edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// Route for new project page
router.get('/new-project', showNewProjectForm);

// Route to handle new project form submission
router.post('/new-project', projectValidation, processNewProjectForm);

router.get(
    '/project/:projectId/assign-categories',
    showAssignCategoriesForm
);

router.post(
    '/project/:projectId/assign-categories',
    processAssignCategoriesForm
);

// Route to display the Edit Project Form (GET)
router.get('/edit-project/:id', showEditProjectForm);

// Route to process the Edit Project Form submission (POST)
router.post('/edit-project/:id', processEditProjectForm);

// --- Create New Category Routes ---
// GET route to display the blank form
router.get('/new-category', showNewCategoryForm);

// POST route to handle form submission with server-side validation middleware
router.post('/new-category', categoryValidation, processNewCategoryForm);


// --- Edit Existing Category Routes ---
// GET route to display the pre-populated form
router.get('/edit-category/:id', showEditCategoryForm);

// POST route to process the category name update with validation middleware
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);

export default router;