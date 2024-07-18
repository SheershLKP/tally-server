const express = require('express');
const router = express.Router();

const {callTallyApi, fetchDataFromTally} = require("../controllers/tally");

router.route('/').get(callTallyApi);
router.route('/getData').post(fetchDataFromTally);


module.exports = router;