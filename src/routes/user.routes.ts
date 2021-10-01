import * as express from "express";
import { verifyApiToken } from "../services/user.service";
import * as userController from "./../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/signin", verifyApiToken, userController.signin);
userRouter.post("/signup", verifyApiToken, userController.signup);

export default userRouter;
