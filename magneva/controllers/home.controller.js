var express = require("express");
var router = express.Router();

router.get("/hello", (req, res) => {
    res.send("Hello world");
    res.end();
})

module.exports = router;