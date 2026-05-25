// src/routes.js
import express from 'express';

import { showHomePage } from './controllers/index.js';
import { showProjectsPage } from './controllers/projects.js';
import { showCategoriesPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage
} from './controllers/organizations.js';

const router = express.Router();

// Home page
router.get('/', showHomePage);

// Existing routes
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);
router.get('/test-error', testErrorPage);

// Organizations routes
router.get('/organizations', showOrganizationsPage);

router.get('/organization/:id', showOrganizationDetailsPage);

export default router;