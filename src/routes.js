import express from 'express';

import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage } from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';
import { showCategoriesPage } from './controllers/categories.js';
import { getCategoryDetails } from './controllers/category.js'; // Imported from our new controller file
import { testErrorPage } from './controllers/errors.js';
import { showOrganizationDetailsPage } from './controllers/organizations.js';

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

export default router;