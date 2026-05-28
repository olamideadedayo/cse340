import {
    getUpcomingProjects,
    getProjectDetails
} from '../models/projects.js';

// Fixed the import path from 'categories.js' to 'category.js'
import {
    getCategoriesByProjectId
} from '../models/category.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Show projects page
const showProjectsPage = async (req, res) => {
    try {
        const projects = await getUpcomingProjects(
            NUMBER_OF_UPCOMING_PROJECTS
        );

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

        // Fetches categories using our newly added model function
        const categories = await getCategoriesByProjectId(id);

        res.render('project', {
            title: project.title,
            project,
            categories // Sent directly to the view
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

export {
    showProjectsPage,
    showProjectDetailsPage
};