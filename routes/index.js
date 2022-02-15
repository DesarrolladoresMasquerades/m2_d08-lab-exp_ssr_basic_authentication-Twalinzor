const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.route("/main").get((req, res) => {
  const userIsLoggedIn = req.session.currentUserId;
  if (userIsLoggedIn) res.render("main");
  else res.render("forbidden");
});

router.route("/private").get((req, res) => {
  const userIsLoggedIn = req.session.currentUserId;
  if (userIsLoggedIn) res.render("gif");
  else res.render("forbidden");
});

module.exports = router;
