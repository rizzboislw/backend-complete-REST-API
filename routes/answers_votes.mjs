import connectionPool from "../utils/db.mjs";
import { Router } from "express";
import { validateAnswerId } from "../middlewares/answers_validation/answersId.post.validation.mjs";

const answersVoteRouter = Router()

answersVoteRouter.post("/:id/upvote", [validateAnswerId], async (req, res) => {
    
    const getUserAnswerId = req.params.id

    try {
        await connectionPool.query(
        ` INSERT INTO answer_votes (answer_id, vote)
          VALUES ($1, 1)
        `,[getUserAnswerId]
        )

        const result = await connectionPool.query(
            ` SELECT
                answers.id,
                answers.question_id,
                answers.content,
                answers.created_at,
                answers.updated_at,
                CAST(SUM(CASE WHEN answer_votes.vote = 1 THEN 1 ELSE 0 END) AS INTEGER) AS upvotes,
                CAST(SUM(CASE WHEN answer_votes.vote = -1 THEN 1 ELSE 0 END) AS INTEGER) AS downvotes
            FROM answers
            LEFT JOIN answer_votes ON answers.id = answer_votes.answer_id
            WHERE answers.id = $1
            GROUP BY answers.id
            `,[getUserAnswerId]
        )

        return res.status(200).json({
            message: "Successfully upvoted the answer.",
            data: result.rows
        })
    } catch {
        return res.status(500).json({
            message: "Server could not upvote the answer due to database connection issues"
        })
    } 
})

answersVoteRouter.post("/:id/downvote", [validateAnswerId], async (req, res) => {
    
    const getUserAnswerId = req.params.id

    try {
        await connectionPool.query(
        ` INSERT INTO answer_votes (answer_id, vote)
          VALUES ($1, -1)
        `,[getUserAnswerId]
        )

        const result = await connectionPool.query(
            ` SELECT
                answers.id,
                answers.question_id,
                answers.content,
                answers.created_at,
                answers.updated_at,
                CAST(SUM(CASE WHEN answer_votes.vote = 1 THEN 1 ELSE 0 END) AS INTEGER) AS upvotes,
                CAST(SUM(CASE WHEN answer_votes.vote = -1 THEN 1 ELSE 0 END) AS INTEGER) AS downvotes
            FROM answers
            LEFT JOIN answer_votes ON answers.id = answer_votes.answer_id
            WHERE answers.id = $1
            GROUP BY answers.id
            `,[getUserAnswerId]
        )

        return res.status(200).json({
            message: "Successfully downvoted the answer.",
            data: result.rows
        })
    } catch{
        return res.status(500).json({
            message: "Server could not downvote an answer due to database connection issues"
        })
    } 
})

export default answersVoteRouter;