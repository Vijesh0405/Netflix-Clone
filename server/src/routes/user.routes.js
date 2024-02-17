import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/").get((req, res) => {
  res.json("Hello from server");
});

router.route("/login").post(loginUser);
router.route("/signup").post(registerUser);

router.route("/logout").post(logoutUser);

export default router;
