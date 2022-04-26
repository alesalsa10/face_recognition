const router = require('express').Router();
const User = require('../Models/User');

router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.user.id)
      .select(['name', 'count'])

    if (!user) {
      return res.status(400).send('Server error');
    }
    return res.status(200).json(user);

  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not Found' });
    }

    return res.status(500).send('Server error');
  }
});


module.exports = router;
