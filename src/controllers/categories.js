import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    updateCategoryAssignments,
    getCategoriesByProjectId
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';

// Show all categories
const showCategoriesPage = async (req, res) => {
    try {
        const categories = await getAllCategories();

        res.render('categories', {
            title: 'Service Categories',
            categories
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Show category details page
const showCategoryDetailsPage = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await getCategoryById(id);

        if (!category) {
            return res.status(404).send('Category not found');
        }

        const projects = await getProjectsByCategoryId(id);

        res.render('category', {
            title: category.name,
            category,
            projects
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Serve the assign categories checkbox form
const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        const projectDetails = await getProjectDetails(projectId);
        const categories = await getAllCategories();
        const assignedCategories = await getCategoriesByProjectId(projectId);

        const title = 'Assign Categories to Project';

        res.render('assign-categories', {
            title,
            projectId,
            projectDetails,
            categories,
            assignedCategories
        });
    } catch (error) {
        console.error('Error in showAssignCategoriesForm:', error);
        next(error);
    }
};

// Process the checkboxes form submission
const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        
        // CORRECTION: Changed from req.body.categories to req.body.categoryIds to match your view template
        const selectedCategoryIds = req.body.categoryIds || [];

        const categoryIdsArray = Array.isArray(selectedCategoryIds)
            ? selectedCategoryIds
            : [selectedCategoryIds];

        await updateCategoryAssignments(projectId, categoryIdsArray);

        req.flash('success', 'Categories updated successfully.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error in processAssignCategoriesForm:', error);
        req.flash('error', 'There was an error updating the categories.');
        res.redirect(`/project/${projectId}`);
    }
};

export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};