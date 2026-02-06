
import express from 'express'
const router = express.Router();
import {interview} from '../controllers//interview.controller.js'
import {signup, login, logout} from '../controllers/user.controller.js'
import authmiddleware from '../middlewares/isAuthenticated.js';



router.route('/signup').post(signup);
router.route('/login').post(login)
router.route('/interview').post(authmiddleware, interview);
router.route('/logout').post(authmiddleware, logout);

// router.route('/Home', authmiddleware).get(Home);
export default router;