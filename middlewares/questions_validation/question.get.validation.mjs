import connectionPool from "../../utils/db.mjs"

export const ValidateGetQuestion = async (req, res, next) => {

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

    next()
}


