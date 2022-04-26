const router = require('express').Router();
const User = require('../Models/User');
router.put('/:id/:count', async (req, res) => {
  try {
    console.log(req.params.count)
    User.findByIdAndUpdate(
      req.params.id,
      { $inc: { count: req.params.count } },
      { new: true },
      function (err, result) {
        if (err) {
          console.log(err);
        }
        console.log(result);
        res.send(result);
      }
    );
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});
module.exports = router;
