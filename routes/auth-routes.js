import express from "express";
const router =express.Router();
import { signUp,login,logOut } from "../controllers/auth-controller.js";


router.post("/signup",signUp);

router.post("/login",login);

router.get("/logout",logOut);

export default router;