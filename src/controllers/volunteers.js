import { addVolunteer, removeVolunteer } from '../models/volunteers.js';

/**
 * Handle adding a logged-in user to a project's volunteer list
 */
export const handleJoinProject = async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.session.user.user_id; // Safe because of requireLogin middleware

    try {
        await addVolunteer(projectId, userId);
        req.flash('success', 'Thank you for volunteering for this project!');
        res.redirect(`/projects/${projectId}`); // Redirects back to the details page
    } catch (error) {
        console.error('Error joining project:', error);
        req.flash('error', 'Could not register your signup. Please try again.');
        res.redirect(`/projects/${projectId}`);
    }
};

/**
 * Handle removing a logged-in user from a project's volunteer list
 */
export const handleLeaveProject = async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.session.user.user_id;

    try {
        await removeVolunteer(projectId, userId);
        req.flash('success', 'You have removed yourself as a volunteer from this project.');
        
        // If they click it from the dashboard, send them back to the dashboard, otherwise details page
        const redirectUrl = req.headers.referer?.includes('/dashboard') ? '/dashboard' : `/projects/${projectId}`;
        res.redirect(redirectUrl);
    } catch (error) {
        console.error('Error leaving project:', error);
        req.flash('error', 'Could not remove your volunteer status. Please try again.');
        res.redirect('/dashboard');
    }
};