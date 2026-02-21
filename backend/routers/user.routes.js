
import express from 'express'
const router = express.Router();
import {getInterviewDetails, interview, InterviewUpdate} from '../controllers//interview.controller.js'
import {signup, login, logout} from '../controllers/user.controller.js'
import authmiddleware from '../middlewares/isAuthenticated.js';



router.route('/signup').post(signup);
router.route('/login').post(login)
router.route('/interview').post(authmiddleware, interview);
router.route('/interview/:id').get(authmiddleware, getInterviewDetails);
router.route('/logout').post(authmiddleware, logout);
router.route('/interview/:id/update').post(authmiddleware, InterviewUpdate);

// router.route('/Home', authmiddleware).get(Home);
export default router;