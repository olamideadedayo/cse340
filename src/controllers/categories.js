import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId
} from '../models/categories.js';

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

export {showCategoriesPage,showCategoryDetailsPage};