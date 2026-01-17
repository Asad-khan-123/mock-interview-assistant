// import express from "express";
// const router = express.Router();
// import { register, login, getProfile, editProfile, getSuggestedUsers, followUnfollow, logout} from "../controllers/user.controller.js";
// import isAuthenticated from "../middlewares/isAuthenticated.js";
// import upload from "../middlewares/multer.js";

// router.route("/register").post(register);
// router.route("/login").post(login);
// router.route("/logout").get(logout);
// router.route("/:id/profile").get(isAuthenticated, getProfile);
// router.route("/profile/edit").post(isAuthenticated, upload.single("profilePicture"), editProfile);
// router.route("/suggested").get(isAuthenticated, getSuggestedUsers);
// router.route("/followUnFollow/:id").get(isAuthenticated, followUnfollow);

// export default router;

import express from 'express'
const router = express.Router();
import {signup, login} from '../controllers/user.controller.js'

router.route('/signup').post(signup);
router.route('/login').post(login)

export default router;