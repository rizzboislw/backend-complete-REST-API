import { Router } from "express"
import connectionPool from "../utils/db.mjs"
import { validateCreateQuestions } from "../middlewares/questions_validation/question.post.validation.mjs"
import { ValidateGetQuestion } from "../middlewares/questions_validation/question.get.validation.mjs"
import { validateUpdateQuestion } from "../middlewares/questions_validation/question.put.validation.mjs"
import { validateDeleteQuestion } from "../middlewares/questions_validation/question.delete.validation.mjs"

const questionsRouter = Router()

questionsRouter.post("/", [validateCreateQuestions], async (req, res) => {

    const createNewQuestions = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date(),
        published_at: new Date()
    }

    try {
        const result = await connectionPool.query(
        `INSERT INTO questions(title, description, category)
         VALUES ($1,$2,$3)
         RETURNING *`,
         [
            createNewQuestions.title,
            createNewQuestions.description,
            createNewQuestions.category
         ]
        )

        return res.status(201).json({
            message: "Question created successfully.",
            data: result.rows
        })
    } catch {
        res.status(500).json({
            message: "Server could not create question due to database connection issues"
        })
    }
})

questionsRouter.get("/", async (req, res) => {

    const title = req.query.title;
    const category = req.query.category;

    try {

       const result = await connectionPool.query(
      ` SELECT * FROM questions 
        WHERE 
            (title = $1 or $1 is null or $1 = '')
            and
            (category = $2 or $2 is null or $2 = '')
      `, [title, category]
    )

    if(!result.rows[0]){
        return res.status(404).json({
            message: "Invalid query parameters"
        });
    } else if(!title && !category){
         return res.status(200).json({
            message: "Successfully retrieved the list of questions.",
            data: result.rows
      })
    } else {
        return res.status(200).json({
            message: "Successfully retrieved the search result",
            data: result.rows
    })}
    } catch {
      return res.status(500).json({
        message: "Server could not read questions due to server connection issues"
      })
  }
})

questionsRouter.get("/:id", [ValidateGetQuestion], async (req, res) => {
    
    const getUserQuestionId = req.params.id;

    try {
        const result = await connectionPool.query(
        ` SELECT * FROM questions
        WHERE id = $1
        `, [getUserQuestionId]
        )

        return res.status(200).json({
            message: "Successfully retrieved the requested question",
            data: result.rows[0]
        })
    } catch {
        return res.status(500).json({
            message: `Server could not find a requested question (question_id:${getUserQuestionId})`
        })
    }

})

questionsRouter.put("/:id", [validateUpdateQuestion], async (req, res) => {

    const getUserQuestionId = req.params.id;
    const updatedQuestion = {
        ...req.body,
        updated_at: new Date()
    }

    try {    
        const result = await connectionPool.query(
        `UPDATE questions
        SET 
            title = $2,
            description = $3,
            category = $4,
            updated_at = $5
        WHERE
            id = $1
        RETURNING *
            `
        ,[
            getUserQuestionId,
            updatedQuestion.title,
            updatedQuestion.description,
            updatedQuestion.category,
            updatedQuestion.updated_at
        ]
    )
        return res.status(200).json({
            message: "Successfully updated the question.",
            data : result.rows[0]
        })
    } catch {
        return res.status(500).json({
            message: "Server could not update a requested question due to database connection issue"
        })
    }
    
})

questionsRouter.delete("/:id", [validateDeleteQuestion], async (req, res) => {
    
    const getUserQuestionId = req.params.id

    try {
        
        const answerCheck = await connectionPool.query(`
            SELECT * FROM answers
            WHERE question_id = $1
            `, [getUserQuestionId]
        )

        if(!answerCheck.rows[0]){
            await connectionPool.query(
                ` DELETE FROM questions
                  WHERE id = $1
                `, [getUserQuestionId] )

            return res.status(200).json({
                message: "Question deleted successfully"
            })
        } else {
            await connectionPool.query(
                ` DELETE FROM answers
                  WHERE question_id = $1
                `, [getUserQuestionId])

            await connectionPool.query(
                ` DELETE FROM questions
                  WHERE id = $1
                `, [getUserQuestionId])
            
            return res.status(200).json({
                message: "Question and its answers deleted successfully."
            })
        }} catch {
        return res.status(500).json({
            message: "Server could not delete a requested question due to database connection issue"
        })
    } 
})

export default questionsRouter;