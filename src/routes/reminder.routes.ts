import * as express from "express";
import * as reminderController from "../controllers/reminder.controller";
import { verifyApiToken } from "../services/user.service";

const reminderRouter = express.Router();

reminderRouter.get(
  "/all",
  verifyApiToken,
  reminderController.getAllRemindersByQuery
);
reminderRouter.post("/", verifyApiToken, reminderController.createReminder);
reminderRouter.put("/", verifyApiToken, reminderController.updateReminder);
reminderRouter.delete("/", verifyApiToken, reminderController.deleteReminder);

export default reminderRouter;
