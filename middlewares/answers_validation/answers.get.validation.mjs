import connectionPool from "../../utils/db.mjs";

export const validateGetAnswer = async (req, res, next) => {
    
    const getUserQuestionId = req.params.id

    const result = await connectionPool.query(
    ` SELECT * FROM answers
      WHERE question_id = $1
    ` ,[getUserQuestionId]
    )

    if(!result.rows[0]){
        return res.status(404).json({
            message: `Question not found (Question_id: ${getUserQuestionId})`
        })
    }

    next()
} 
