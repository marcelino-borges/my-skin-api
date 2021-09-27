import * as express from "express";
import * as userController from "./../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/signin", userController.signin);
userRouter.post("/signup", userController.signup);

export default userRouter;
