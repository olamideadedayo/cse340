import * as categoryModel from '../models/category.js';

/**
 * Handle GET request for the Category Details Page (/category/:id)
 */
export async function getCategoryDetails(req, res, next) {
    try {
        const categoryId = req.params.id;
        
        // Fetch the category info and its associated projects in parallel
        const [category, projects] = await Promise.all([
            categoryModel.getCategoryById(categoryId),
            categoryModel.getProjectsByCategoryId(categoryId)
        ]);

        // Trigger a clean 404 if the category ID doesn't exist in the database
        if (!category) {
            const err = new Error('Category Not Found');
            err.status = 404;
            return next(err);
        }

       // Inside src/controllers/category.js, update the res.render line near the bottom:
res.render('category', {
    title: category.name,
    category,
    projects
});

    } catch (error) {
        // Forward any unexpected errors to your global error handler
        next(error);
    }
}
