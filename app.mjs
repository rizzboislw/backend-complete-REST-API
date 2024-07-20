import express from "express";
import questionsRouter from "./routes/questions.mjs";
import answersRouter from "./routes/answers.mjs";
import questionVoteRouter from "./routes/questions_votes.mjs";
import answersVoteRouter from "./routes/answers_votes.mjs";

const app = express();
const port = 4000;

app.use(express.json());
app.use("/questions", questionsRouter)
app.use("/questions", answersRouter)
app.use("/questions", questionVoteRouter)
app.use("/answers", answersVoteRouter)


app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
