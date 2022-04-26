const router = require('express').Router();
const User = require('../Models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

router.post(
  '/register',
  [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be 8+ characters').isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const doesEmailExist = await User.findOne({ email: req.body.email });

    if (doesEmailExist) {
      //return res.status(400).json({ error: 'Email already exists' });
      return res
        .status(400)
        .json({ errors: [{ msg: 'Email already in use' }] });
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password, //hashed password
    });
    try {
      const savedUser = await user.save();
      const payload = {
        user: {
          id: savedUser.id,
        },
      };

      //token to be sent in the header to access authenticated routes
      jwt.sign(payload, config.get('TOKEN_SECRET'), (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
);

//login route
router.post(
  '/signin',
  [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be 8+ characters').isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findOne({ email: req.body.email });
    //throw error if email is wrong
    if (!user)
      return res
        .status(400)
        .json({ errors: [{ msg: 'Wrong credentials, try again' }] });

    //check password with bcrypt compare
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Wrong credentials, try again' }] });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    //token to be sent in the header to access authenticated routes
    jwt.sign(
      payload,
      config.get('TOKEN_SECRET'),
      //{ expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  }
);

module.exports = router;
