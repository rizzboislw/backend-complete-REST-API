import connectionPool from "../../utils/db.mjs";

export const validateAnswerId = async (req, res, next) => {

    const getAnswerId = req.params.id

    const result = await connectionPool.query(
        ` SELECT * FROM answers
          WHERE id = $1
        `, [getAnswerId]
    )

    if(!result.rows[0]){
        return res.status(404).json({
            message: `Answer not found (answer_id: ${getAnswerId})`
        })
    }

    next()
}