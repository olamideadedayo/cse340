// Import any needed model functions
import {getUpcomingProjects,getProjectDetails} from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define any controller functions
const showProjectsPage = async (req, res) => {
    try {
        const projects = await getUpcomingProjects(
            NUMBER_OF_UPCOMING_PROJECTS
        );

        const title = 'Upcoming Service Projects';

        res.render('projects', { title, projects });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

const showProjectDetailsPage = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await getProjectDetails(id);

        if (!project) {
            return res.status(404).send('Project not found');
        }

        res.render('project', {
            title: project.title,
            project
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Export any controller functions
export {showProjectsPage,showProjectDetailsPage
};
