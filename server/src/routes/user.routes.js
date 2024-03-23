import { Router } from "express";
import {
  getCookie,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get((req, res) => {
  res.json("Hello from server");
});

router.route("/login").post(loginUser);
router.route("/signup").post(registerUser);
router.route('/get-cookie')
.get(verifyJwt,getCookie)
router.route("/logout").post(verifyJwt,logoutUser);

export default router;
