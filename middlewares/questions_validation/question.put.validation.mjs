import connectionPool from "../../utils/db.mjs";

export const validateUpdateQuestion = async (req, res, next) => {
    
    const getUserQuestionId = req.params.id

    const result = await connectionPool.query(
        `
        SELECT *
        FROM questions
        WHERE id = $1
        `,[getUserQuestionId]
        )

        if(!result.rows[0]){
            return res.status(404).json({
                message: `Question not found (Question_id: ${getUserQuestionId})`
            })
        }

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