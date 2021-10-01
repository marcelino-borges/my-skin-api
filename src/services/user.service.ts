import { Request, Response } from "express";
import AppError, {
  EMAIL_ALREADY_EXISTS,
  ERROR_SIGNUP,
  FAIL_AUTH_TOKEN,
  INTERNAL_ERROR,
  INVALID_CREDENTIALS,
  NOT_AUTHORIZED,
  NO_TOKEN_PROVIDED,
} from "./../errors/app-error";
import jwt from "jsonwebtoken";
import user, { IUser } from "./../models/user.models";
import auth, { IUserAuth } from "./../models/user-auth.models";
import { log } from "../utils/utils";

export const signin = async (req: Request, res: Response, next: any) => {
  try {
    const email: string = req.body.email as string;
    const password: string = req.body.password as string;

    if (!email && !password)
      return res.status(400).json(new AppError(INVALID_CREDENTIALS, 400));

    const userFound = await checkCredentialsAndGetUser(email, password);

    if (userFound) return res.status(200).json(userFound);

    return res.status(401).json(new AppError(NOT_AUTHORIZED, 401));
  } catch (e: any) {
    log("ERROR: ", e.message);
    return res.status(500).json(new AppError(e.message, 500));
  }
};

export const signup = async (req: Request, res: Response, next: any) => {
  try {
    const password = req.body.password as string;
    const email = req.body.email as string;
    const newUser: IUser = {
      email,
      firstName: req.body.firstName as string,
      lastName: req.body.lastName as string,
      profilePictureUrl: req.body.profilePictureUrl as string,
      birthDate: new Date(req.body.birthDate),
      isPremium: req.body.isPremium as boolean,
    };

    let userFound: IUserAuth = await auth.findOne({ email }).lean();

    if (userFound) {
      return res.status(400).json(new AppError(EMAIL_ALREADY_EXISTS, 400));
    }

    const authCreated = await auth.create({
      email,
      password,
    });

    if (authCreated) {
      const userCreated = await user.create(newUser);
      if (userCreated) return res.status(200).json(userCreated);
    }
    // Ensuring that no user is persisted if the method get an error
    await deleteUserCompletlyFromDatabasesByEmail(email);
    return res.status(400).json(new AppError(ERROR_SIGNUP, 400));
  } catch (e: any) {
    log("ERROR: ", e.message);
    // Ensuring that no user is persisted if the method get an error
    await deleteUserCompletlyFromDatabasesByEmail(req.body.email as string);
    return res.status(500).json(new AppError(e.message, 500));
  }
};

export const verifyJWT = (req: Request, res: Response, next: any) => {
  const token = req.headers["Authorization"] as string;
  const apiKey = process.env.API_KEY;
  if (!apiKey) return res.status(500).json(new AppError(INTERNAL_ERROR, 500));
  if (!token) return res.status(401).json(new AppError(NO_TOKEN_PROVIDED, 401));

  if (token !== apiKey)
    return res.status(401).json(new AppError(NOT_AUTHORIZED, 401));
  else next();
};

const checkCredentialsAndGetUser = async (email: string, password: string) => {
  let userAuthFound: IUserAuth = await auth
    .findOne({
      $and: [{ email: email }, { password: password }],
    })
    .lean();

  if (userAuthFound) {
    const userFound: IUser = await user
      .findOne({ email: userAuthFound.email })
      .lean();

    if (userFound) return userFound;
  }
  return null;
};

const deleteUserCompletlyFromDatabasesByEmail = async (email: string) => {
  await auth.findOneAndDelete({ email });
  await user.findOneAndDelete({ email });
};
