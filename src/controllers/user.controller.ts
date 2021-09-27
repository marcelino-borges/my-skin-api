import { Request, Response } from "express";
import * as userService from "./../services/user.service";

export const signin = async (req: Request, res: Response, next: any) => {
  return userService.signin(req, res, next);
};

export const signup = async (req: Request, res: Response, next: any) => {
  return userService.signup(req, res, next);
};
