import { Request, Response } from "express";
import AppError, {
  EMAIL_ALREADY_EXISTS,
  ERROR_SIGNUP,
  FAIL_AUTH_TOKEN,
  INTERNAL_ERROR,
  INVALID_CREDENTIALS,
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

    const generatedTokenAndUser = await generateJwtToken(email, password);

    if (generatedTokenAndUser)
      return res.status(200).json(generatedTokenAndUser);

    return res.status(401).json(new AppError(INVALID_CREDENTIALS, 401));
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
      const generatedTokenAndUser = await generateJwtToken(
        newUser.email,
        password
      );

      if (userCreated && generatedTokenAndUser) {
        return res.status(200).json(generatedTokenAndUser);
      }
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
  const token = req.headers["api-token"] as string;
  const secret = process.env.API_KEY;
  if (!secret) return res.status(500).json(new AppError(INTERNAL_ERROR, 500));
  if (!token) return res.status(401).json(new AppError(NO_TOKEN_PROVIDED, 401));

  jwt.verify(token, secret, function (err, decoded) {
    if (err) return res.status(500).json(new AppError(FAIL_AUTH_TOKEN, 500));
    next();
  });
};

const generateJwtToken = async (email: string, password: string) => {
  let userFound: IUserAuth = await auth
    .findOne({
      $and: [{ email: email }, { password: password }],
    })
    .lean();

  if (userFound) {
    const userId = userFound._id;
    const secret = process.env.API_KEY;
    if (userId && secret) {
      const token = jwt.sign({ id: userId }, secret, {
        expiresIn: 1800, // expires in 30min
      });
      const userData: IUser = await user
        .findOne({ email: userFound.email })
        .lean();

      if (token && userData) return { token: token, user: userData };
    }
  }
  return null;
};

const deleteUserCompletlyFromDatabasesByEmail = async (email: string) => {
  await auth.findOneAndDelete({ email });
  await user.findOneAndDelete({ email });
};
