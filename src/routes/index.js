const routes = require('express').Router();
const authMiddleware = require('../middlewares/auth');

const AuthController = require('../controllers/AuthController');
const SignupController = require('../controllers/SignupController');
const UserController = require('../controllers/UserController');

routes.post('/signin', AuthController.authenticate);
routes.post('/signup', SignupController.store);
routes.use(authMiddleware);

routes.get('/user/:userId', UserController.profile);

module.exports = routes;
