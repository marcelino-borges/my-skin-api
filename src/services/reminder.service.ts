import { Request, Response } from "express";
import AppError, {
  ERROR_CREATE_REMINDER,
  ERROR_DELETE_REMINDER,
  ERROR_UPDATE_REMINDER,
  INVALID_REQUEST,
  MISSING_USER_EMAIL,
  MISSING_USER_ID,
  REMINDERS_NOT_FOUND,
} from "../errors/app-error";
import reminder, { IReminder, IUserReminders } from "../models/reminder.models";

export const getAllRemindersByUserId = async (
  req: Request,
  res: Response,
  next: any
) => {
  try {
    const userId: string = req.query.id as string;

    if (!userId)
      return res.status(400).json(new AppError(MISSING_USER_ID, 400));

    const remindersFound: IUserReminders = await reminder
      .findOne({ userId })
      .lean();

    if (
      remindersFound &&
      remindersFound.reminders &&
      remindersFound.reminders.length > 0
    ) {
      return res.status(200).json(remindersFound.reminders);
    }
    return res.status(400).json(new AppError(REMINDERS_NOT_FOUND, 400));
  } catch (e: any) {
    return res.status(500).json(new AppError(e.message, 500));
  }
};

export const getAllRemindersByUserEmail = async (
  req: Request,
  res: Response,
  next: any
) => {
  try {
    const userEmail: string = req.query.userEmail as string;

    if (!userEmail)
      return res.status(400).json(new AppError(MISSING_USER_EMAIL, 400));

    const remindersFound: IUserReminders = await reminder
      .findOne({ email: userEmail })
      .lean();

    if (
      remindersFound &&
      remindersFound.reminders &&
      remindersFound.reminders.length > 0
    ) {
      return res.status(200).json(remindersFound.reminders);
    }
    return res.status(400).json(new AppError(REMINDERS_NOT_FOUND, 400));
  } catch (e: any) {
    return res.status(500).json(new AppError(e.message, 500));
  }
};

export const createReminder = async (
  req: Request,
  res: Response,
  next: any
) => {
  try {
    const email: string = req.body.email as string;
    const reminderToCreate: IReminder = req.body.reminder as IReminder;

    if (!email || !reminderToCreate)
      return res.status(400).json(new AppError(INVALID_REQUEST, 400));

    const remindersFound: IUserReminders = await reminder
      .findOne({ email })
      .lean();

    if (remindersFound) {
      let remindersList: IReminder[] = remindersFound.reminders;

      if (!remindersList) remindersList = [reminderToCreate];
      else remindersList.push(reminderToCreate);

      const remindersUpdated: IUserReminders = await reminder
        .findOneAndUpdate(
          {
            email,
          },
          { reminders: remindersList },
          { new: true }
        )
        .lean();

      if (remindersUpdated)
        return res.status(200).json(remindersUpdated.reminders);
    }
    return res.status(400).json(new AppError(ERROR_CREATE_REMINDER, 400));
  } catch (e: any) {
    return res.status(500).json(new AppError(e.message, 500));
  }
};

export const updateReminder = async (
  req: Request,
  res: Response,
  next: any
) => {
  try {
    const email: string = req.body.email as string;
    const reminderToUpdate: IReminder = req.body.reminder as IReminder;

    if (!email || !reminderToUpdate)
      return res.status(400).json(new AppError(INVALID_REQUEST, 400));

    const remindersFound: IUserReminders = await reminder
      .findOne({ email })
      .lean();

    if (remindersFound) {
      let remindersList: IReminder[] = remindersFound.reminders;

      remindersList = remindersList.map((r) => {
        let reminder = r;

        if (reminder._id == reminderToUpdate._id) {
          reminder = reminderToUpdate;
        }
        return reminder;
      });

      const remindersUpdated: IUserReminders = await reminder
        .findOneAndUpdate(
          {
            email,
          },
          { reminders: remindersList },
          { new: true }
        )
        .lean();

      if (remindersUpdated)
        return res.status(200).json(remindersUpdated.reminders);
    }
    return res.status(400).json(new AppError(ERROR_UPDATE_REMINDER, 400));
  } catch (e: any) {
    return res.status(500).json(new AppError(e.message, 500));
  }
};

export const deleteReminder = async (
  req: Request,
  res: Response,
  next: any
) => {
  try {
    const email: string = req.body.email as string;
    const reminderToDelete: IReminder = req.body.reminder as IReminder;

    if (!email || !reminderToDelete)
      return res.status(400).json(new AppError(INVALID_REQUEST, 400));

    const remindersFound: IUserReminders = await reminder
      .findOne({ email })
      .lean();

    if (remindersFound) {
      let remindersList: IReminder[] = remindersFound.reminders;

      remindersList = remindersList.filter((r) => {
        return r._id !== reminderToDelete._id;
      });

      const remindersUpdated: IUserReminders = await reminder
        .findOneAndUpdate(
          {
            email,
          },
          { reminders: remindersList },
          { new: true }
        )
        .lean();

      if (remindersUpdated)
        return res.status(200).json(remindersUpdated.reminders);
    }
    return res.status(400).json(new AppError(ERROR_DELETE_REMINDER, 400));
  } catch (e: any) {
    return res.status(500).json(new AppError(e.message, 500));
  }
};
