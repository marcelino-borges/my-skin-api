import helmet from "helmet";
import express from "express";
import connectMongo from "./mongo/config";
import userRouter from "./routes/user.routes";
import reminderRouter from "./routes/reminder.routes";
import dotenvSafe from "dotenv-safe";

dotenvSafe.config({
  allowEmptyValues: true,
});

const PORT = parseInt(process.env.PORT as string, 10);

console.log("PORT on env: ", PORT);

const app = express();
connectMongo();

app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/reminder", reminderRouter);

app.listen(PORT || 8080, () => {
  console.log(`Listening on port ${PORT}`);
});
