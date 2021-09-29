import * as express from "express";
import * as reminderController from "../controllers/reminder.controller";
import { verifyJWT } from "../services/user.service";

const reminderRouter = express.Router();

reminderRouter.get(
  "/all",
  verifyJWT,
  reminderController.getAllRemindersByQuery
);
reminderRouter.post("/", verifyJWT, reminderController.createReminder);
reminderRouter.put("/", verifyJWT, reminderController.updateReminder);
reminderRouter.delete("/", verifyJWT, reminderController.deleteReminder);

export default reminderRouter;
