// userRoutes
const router = require('express').Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  login,
  signupHandler,
  logout,
} = require('../../../controllers/userController');

router.route('/')
  .get(getAllUsers) // remove after testing
  .post(createUser);

router.post('/signup', signupHandler);
router.post('/login', login);
router.post('/logout', logout);

router.route('/:userId')
  .get(getUserById);
// /api/users/:userId
// router.route('/:userId')
// 	.delete(deleteUserById)
// 	.get(getUserById)
// 	.put(updateUserById)
module.exports = router;
