// 1. ALL IMPORTS AT THE VERY TOP
import { 
    getUpcomingProjects, 
    getProjectDetails, 
    createProject,
    updateProject // Added import to ensure code runs without errors
} from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/category.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

// 2. VALIDATION CONFIGURATION ARRAY
const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

// Constants
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// 3. CONTROLLER FUNCTIONS

// Serve the new project form
const showNewProjectForm = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Add New Service Project';
        res.render('new-project', { title, organizations });
    } catch (error) {
        console.error('Error loading new project form:', error);
        next(error);
    }
};

// Process the form submission
const processNewProjectForm = async (req, res, next) => {
    // Check for server-side validation errors first
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        // Stop execution and bounce back to the form page
        return res.redirect('/new-project');
    }

    // Extract form data from req.body if validation passes
    const { title, description, location, date, organizationId } = req.body;

    try {
        // Create the new project in the database
        await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect('/projects'); 
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
};

// Show projects page
const showProjectsPage = async (req, res) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        res.render('projects', {
            title: 'Upcoming Service Projects',
            projects
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Show single project details
const showProjectDetailsPage = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await getProjectDetails(id);

        if (!project) {
            return res.status(404).send('Project not found');
        }

        const categories = await getCategoriesByProjectId(id);

        res.render('project', {
            title: project.title,
            project,
            categories
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Display the Edit Service Project Form (GET) - CONVERTED TO ARROW FUNCTION FOR CONSISTENCY
const showEditProjectForm = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        
        // 1. Get the project data from the model
        const project = await getProjectDetails(projectId);
        
        // 2. Get a list of all organizations for the dropdown selector
        const organizations = await getAllOrganizations();
        
        if (!project) {
            const err = new Error('Project not found');
            err.status = 404;
            throw err;
        }

        // Format the date to YYYY-MM-DD so it cleanly populates the HTML5 date picker input field
        if (project.date) {
            const dateObj = new Date(project.date);
            project.formattedDate = dateObj.toISOString().split('T')[0];
        }

        // 3. Pass this data to the edit view template
        res.render('edit-project', {
            title: `Edit ${project.title}`,
            project,
            organizations,
            errors: null
        });
    } catch (error) {
        next(error);
    }
};

// Process the Update Form Submission (POST) - CONVERTED TO ARROW FUNCTION FOR CONSISTENCY
const processEditProjectForm = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const { title, description, location, date, organizationId } = req.body;

        // Pass form data parameters to our updated model function
        await updateProject(projectId, title, description, location, date, organizationId);

        // Redirect the user back to the individual project details page after the update is complete
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};

// 4. UNIFIED EXPORTS AT THE BOTTOM
export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
};