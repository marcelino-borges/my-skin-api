import * as express from "express";
import { verifyJWT } from "../services/user.service";
import * as userController from "./../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/signin", verifyJWT, userController.signin);
userRouter.post("/signup", verifyJWT, userController.signup);

export default userRouter;
