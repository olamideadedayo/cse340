// 1. ALL IMPORTS AT THE VERY TOP
// 1. ALL IMPORTS AT THE VERY TOP
// Existing functions from the plural models file
import {
    getAllCategories,
    updateCategoryAssignments,
    
} from '../models/categories.js';

// Functions from the singular model file
import {
    getCategoryById,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    createCategory, 
    updateCategory  
} from '../models/category.js'; 

import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';
// 2. VALIDATION CONFIGURATION ARRAY
// Client-side max-length is 100. Server-side checks: min length 3, max length 100, not empty.
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters')
];

// 3. CONTROLLER FUNCTIONS

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

// Serve the new category form (GET /new-category)
const showNewCategoryForm = async (req, res, next) => {
    try {
        res.render('new-category', { 
            title: 'Add New Category',
            errors: null,
            categoryName: ''
        });
    } catch (error) {
        console.error('Error loading new category form:', error);
        next(error);
    }
};

// Process new category form submission (POST /new-category)
const processNewCategoryForm = async (req, res, next) => {
    const errors = validationResult(req);
    const { name } = req.body;

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.render('new-category', {
            title: 'Add New Category',
            categoryName: name
        });
    }

    try {
        await createCategory(name);
        req.flash('success', 'New category created successfully!');
        res.redirect('/categories'); 
    } catch (error) {
        console.error('Error creating new category:', error);
        req.flash('error', 'There was an error creating the category.');
        res.render('new-category', { title: 'Add New Category', categoryName: name });
    }
};

// Serve the edit category form (GET /edit-category/:id)
const showEditCategoryForm = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);

        if (!category) {
            const err = new Error('Category not found');
            err.status = 404;
            throw err;
        }

        res.render('edit-category', {
            title: `Edit Category: ${category.name}`,
            category,
            errors: null
        });
    } catch (error) {
        console.error('Error loading edit category form:', error);
        next(error);
    }
};

// Process edit category update submission (POST /edit-category/:id)
const processEditCategoryForm = async (req, res, next) => {
    const categoryId = req.params.id;
    const { name } = req.body;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        
        return res.render('edit-category', {
            title: `Edit Category`,
            category: { category_id: categoryId, name },
        });
    }

    try {
        await updateCategory(categoryId, name);
        req.flash('success', 'Category updated successfully!');
        res.redirect(`/category/${categoryId}`); 
    } catch (error) {
        console.error('Error updating category:', error);
        req.flash('error', 'There was an error updating the category.');
        res.render('edit-category', {
            title: `Edit Category`,
            category: { category_id: categoryId, name },
        });
    }
};

// 4. UNIFIED EXPORTS AT THE BOTTOM
export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
};
