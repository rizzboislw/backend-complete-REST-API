export const validateCreateQuestions = (req, res, next) => {
    
    if (!req.body.title){
        return res.status(400).json({
            message: "Missing or invalid request data (Please enter a title for the question)"
        })
    }

    if (!req.body.description){
        return res.status(400).json({
            message: "Missing or invalid request data (Please enter a description for the question)"
        })
    }

    if (!req.body.category){
        return res.status(400).json({
            message: "Missing or invalid request data (Please enter a category for the question)"
        })
    }

    next()
}