import { Schema, model } from "mongoose";

export interface IUserReminders {
  _id?: string;
  userId: string;
  email: string;
  reminders: IReminder[];
}

export interface IReminder {
  _id?: string;
  title: string;
  description: string;
  active: boolean;
  repeat: ReminderRepeat;
  daysOfWeekToAlarm: DaysOfWeek;
}

enum ReminderRepeat {
  none,
  daily,
  weekDays,
  weekEnds,
  specificDays,
}

enum DaysOfWeek {
  sunday,
  monday,
  tuesday,
  wednesday,
  friday,
  saturday,
}

const schema = new Schema<IUserReminders>(
  {
    userId: { type: String, require: true },
    email: { type: String, require: true },
    reminders: {
      type: {
        title: { type: String, require: true },
        description: { type: String, require: true },
        active: { type: Boolean, require: true },
        repeat: { type: ReminderRepeat, require: true },
        daysOfWeek: { type: Array },
      },
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUserReminders>("UserReminders", schema);
