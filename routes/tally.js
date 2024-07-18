const express = require('express');
const router = express.Router();

const {callTallyApi, fetchDataFromTally} = require("../controllers/tally");

router.route('/').get(callTallyApi);
router.route('/getData').get(fetchDataFromTally);


module.exports = router;