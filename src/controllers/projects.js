// src/controllers/projects.js
import { getAllProjects } from '../models/projects.js';

// Define the controller function
const showProjectsPage = async (req, res) => {
    const projects = await getAllProjects();
    const title = 'Service Projects';

    res.render('projects', { title, projects });
};

// Export the controller function
export { showProjectsPage };
