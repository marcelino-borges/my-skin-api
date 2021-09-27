import { Request, Response } from "express";
import * as reminderService from "../services/reminder.service";

export const getAllRemindersByUserId = async (
  req: Request,
  res: Response,
  next: any
) => {
  return reminderService.getAllRemindersByUserId(req, res, next);
};

export const getAllRemindersByUserEmail = async (
  req: Request,
  res: Response,
  next: any
) => {
  return reminderService.getAllRemindersByUserEmail(req, res, next);
};

export const createReminder = async (
  req: Request,
  res: Response,
  next: any
) => {
  return reminderService.createReminder(req, res, next);
};

export const updateReminder = async (
  req: Request,
  res: Response,
  next: any
) => {
  return reminderService.updateReminder(req, res, next);
};

export const deleteReminder = async (
  req: Request,
  res: Response,
  next: any
) => {
  return reminderService.deleteReminder(req, res, next);
};
