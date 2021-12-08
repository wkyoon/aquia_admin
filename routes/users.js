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

  const queryApi = client.getQueryApi(org)
  //const query = `from(bucket: "manta") |> range(start: -1h)`
  const fluxQuery = 'from(bucket:"manta") |>  range(start: -3d) |> filter(fn: (r) => r["device_id"] == "7c6e3a93-a0bb-f33f-b538-4ea07a3974ec" or r["device_id"] == "1ed3e296-d046-382d-210c-4a294e96943c" ) |> filter(fn: (r) => r["_field"] == "salt" or r["_field"] == "battery" or r["_field"] == "temperature")'
  
  var items = []
  var dicItem = {}

  const fluxObserver = {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row)
      //items.push(o)
      //console.log(o)
      // console.log(
      //   `${o._time} (${o.device_id}): ${o._field}=${o._value}`
      // )
      if(`${o._field}` =="salt")
        items.push({"time":`${o._time}`,"device_id":`${o.device_id}`,"type":"salt","value":`${o._value}`})
      else if(`${o._field}` =="battery")
        items.push({"time":`${o._time}`,"device_id":`${o.device_id}`,"type":"battery","value":`${o._value}`})
      else if(`${o._field}` =="temperature")
        items.push({"time":`${o._time}`,"device_id":`${o.device_id}`,"type":"temperature","value":`${o._value}`})

        //items[`${o._time}`][`${o._field}`] = `${o._value}`

    },
    error(error) {
      console.error(error)
      console.log('\nFinished ERROR')
    },
    complete() {
      console.log('\nFinished SUCCESS')

      var devicelist_salt = {}
      var devicelist_battery = {}
      var devicelist_temperature = {}

      var data1 =[]
      var data2 =[]
      for(idx in items)
      {
        

        if(items[idx]['type']=="salt")
          devicelist_salt[items[idx]['device_id']] = [items[idx]['time'],items[idx]['value']*10]
        if(items[idx]['type']=="battery")
          devicelist_battery[items[idx]['device_id']] = [items[idx]['time'],items[idx]['value']]
        if(items[idx]['type']=="temperature")
          devicelist_temperature[items[idx]['device_id']] = [items[idx]['time'],items[idx]['value']]

        if(items[idx]['device_id']=="7c6e3a93-a0bb-f33f-b538-4ea07a3974ec" && items[idx]['type']=="salt")
        {
          const unixTimeZero = Date.parse(items[idx]['time']);
          data2.push({date:unixTimeZero,value:items[idx]['value']*10})
          
          //console.log('unixTimeZero',unixTimeZero)

        }
        if(items[idx]['device_id']=="1ed3e296-d046-382d-210c-4a294e96943c" && items[idx]['type']=="salt")
        {
          const unixTimeZero = Date.parse(items[idx]['time']);
          data1.push({date:unixTimeZero,value:items[idx]['value']*10})
          
          //console.log('unixTimeZero',unixTimeZero)

        }
      }
      
      // console.log(devicelist_salt)
      // console.log(devicelist_battery)
      // console.log(devicelist_temperature)
      //console.log(data2)
      // for (var key in dicItem) { 
      //   console.log("key : " + key +", value : " + dicItem[key]); 
      // }


  //    res.send({  result: 'success',items: items });
      res.render('index2', { title: '아쿠아프로(하동)',salts:devicelist_salt,battery:devicelist_battery,temperature:devicelist_temperature ,data1:JSON.stringify(data1),data2:JSON.stringify(data2)});
    }
  }
  
  /** Execute a query and receive line table metadata and rows. */
  queryApi.queryRows(fluxQuery, fluxObserver)

     


  
});



module.exports = router;
