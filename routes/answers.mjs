import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateGetAnswer } from "../middlewares/answers_validation/answers.get.validation.mjs";
import { validatePostAnswers } from "../middlewares/answers_validation/answers.post.validation.mjs";

const answersRouter = Router()

answersRouter.post("/:id/answers", [validatePostAnswers], async (req, res) => {

    const getUserQuestionId = req.params.id

    const newAnswer = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date(),
        question_id: getUserQuestionId
    }

    try {
        const result = await connectionPool.query(
        ` INSERT into answers(content,question_id)
          VALUES($1, $2)
          RETURNING *
        `, [ 
            newAnswer.content,
            newAnswer.question_id
         ]
        )

        return res.status(201).json({
            message: "Answer created successfully.",
            data: result.rows[0]
        })
    } catch {
        return res.status(500).json({
            message: "Server could not create an answer due to database connection issues"
        })
    }

})

answersRouter.get("/:id/answers", [validateGetAnswer], async (req, res) => {
   
    const getUserQuestionId = req.params.id

    try {     
        const result = await connectionPool.query(
        ` SELECT * FROM answers
         WHERE question_id = $1
        `, [getUserQuestionId]
        )

        return res.status(200).json({
            message: "Successfully retrieved the answers",
            data: result.rows
        })
    } catch {
        return res.status(500).json({
            message: "Server could not read questions due to server connection issues"
        })
    }
})

export default answersRouter
