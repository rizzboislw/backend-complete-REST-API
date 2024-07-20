import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { ValidateGetQuestion } from "../middlewares/questions_validation/question.get.validation.mjs";

const questionVoteRouter = Router()

questionVoteRouter.post("/:id/upvote", [ValidateGetQuestion], async (req, res) => {

    const getUserQuestionId = req.params.id

    try {
        await connectionPool.query(
            `INSERT INTO question_votes (question_id, vote)
             VALUES ($1, 1)`,
            [getUserQuestionId]
        );

        const result = await connectionPool.query(
        `
        SELECT
	        questions.id,
            questions.title,
            questions.description,
            questions.category,
            questions.created_at,
            questions.updated_at,
            CAST(SUM(CASE WHEN question_votes.vote = 1 THEN 1 ELSE 0 END) AS INTEGER) AS upvotes,
            CAST(SUM(CASE WHEN question_votes.vote = -1 THEN 1 ELSE 0 END) AS INTEGER) AS downvotes
        FROM questions
        LEFT JOIN question_votes ON questions.id = question_votes.question_id
        WHERE questions.id = $1
        GROUP BY questions.id`, [getUserQuestionId]
        )

        return res.status(200).json({
            message: "Successfully upvoted the question.",
            data: result.rows
        })
    } catch {
        return res.status(500).json({
            message: "Server could not upvote a question due to database connection issues"
        })
    }
})

questionVoteRouter.post("/:id/downvote", [ValidateGetQuestion], async (req, res) => {

    const getUserQuestionId = req.params.id

    try {
        await connectionPool.query(
            `INSERT INTO question_votes (question_id, vote)
             VALUES ($1, -1)`,
            [getUserQuestionId]
        );

        const result = await connectionPool.query(
        `
        SELECT
	        questions.id,
            questions.title,
            questions.description,
            questions.category,
            questions.created_at,
            questions.updated_at,
            CAST(SUM(CASE WHEN question_votes.vote = 1 THEN 1 ELSE 0 END) AS INTEGER) AS upvotes,
            CAST(SUM(CASE WHEN question_votes.vote = -1 THEN 1 ELSE 0 END) AS INTEGER) AS downvotes
        FROM questions
        LEFT JOIN question_votes ON questions.id = question_votes.question_id
        WHERE questions.id = $1
        GROUP BY questions.id`, [getUserQuestionId]
        )

        return res.status(200).json({
            message: "Successfully downvoted the question.",
            data: result.rows
        })
    } catch {
        return res.status(500).json({
            message: "Server could not downvote the question due to database connection issues"
        })
    }
})

export default questionVoteRouter