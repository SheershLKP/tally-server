const express = require('express');
const router = express.Router();

const {callTallyApi} = require("../controllers/tally");

router.route('/').get(callTallyApi);

module.exports = router;