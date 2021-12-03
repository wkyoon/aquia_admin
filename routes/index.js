var express = require('express');
var router = express.Router();

const {InfluxDB} = require('@influxdata/influxdb-client')

// You can generate an API token from the "API Tokens Tab" in the UI
const token = 'HXQ1teSr0f7SCZIKbx9RxpbyoNA_bx8NKOs553pCs3_tVJALJyxf7PSqwwZorjpK-7pyd8bbgOSghVbeT8JVgw=='
const org = 'sothecode'
const bucket = 'manta'

const client = new InfluxDB({url: 'http://influx.mantaraycode.com:8086', token: token})


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
