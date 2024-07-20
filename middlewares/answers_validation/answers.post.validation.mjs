import connectionPool from "../../utils/db.mjs";

export const validatePostAnswers = async (req, res, next) => {

    const getUserQuestionId = req.params.id

    const result = await connectionPool.query(
        ` SELECT * FROM questions
          WHERE id = $1
        `, [getUserQuestionId]
    )

    if(!result.rows[0]){
        return res.status(404).json({
            message: `Question not found (question_id: ${getUserQuestionId})`
        })
    }

    if(!req.body.content){
        return res.status(400).json({
            message: "Missing or invalid request data (Please enter your answer)"
        })
    }

    if(req.body.content.length > 300){
        return res.status(400).json({
            message: "Answer content exceeds the maximum allowed length of 300 characters."
        })
    }

    next()
}