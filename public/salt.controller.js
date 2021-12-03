
const {InfluxDB,Point} = require('@influxdata/influxdb-client')

// You can generate an API token from the "API Tokens Tab" in the UI
const token = 'HXQ1teSr0f7SCZIKbx9RxpbyoNA_bx8NKOs553pCs3_tVJALJyxf7PSqwwZorjpK-7pyd8bbgOSghVbeT8JVgw=='
const org = 'sothecode'
const bucket = 'manta'

const client = new InfluxDB({url: 'http://influx.mantaraycode.com:8086', token: token})





exports.saltinfo = async (req, res) => {

  console.log('salt info request ',req.query)


// const writeApi = client.getWriteApi(org, bucket)
// writeApi.useDefaultTags({host: 'host1'})

// const point = new Point('mem').floatField('used_percent', 23.43234543)
// writeApi.writePoint(point)

// writeApi
//     .close()
//     .then(() => {
//         console.log('FINISHED')
//     })
//     .catch(e => {
//         console.error(e)
//         console.log('Finished ERROR')
//     })


   const queryApi = client.getQueryApi(org)

   //const fluxQuery = `from(bucket: "manta") |> range(start: -1h)`

   const fluxQuery = 'from(bucket:"manta") |> range(start: -3h) |> filter(fn: (r) => r._measurement == "codemeter_ep1_logs")'
   
   var items = []

   const fluxObserver = {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row)
      items.push(o)
      console.log(
        `${o._time} ${o._measurement} in ${o.region} (${o.sensor_id}): ${o._field}=${o._value}`
      )
    },
    error(error) {
      console.error(error)
      console.log('\nFinished ERROR')
    },
    complete() {
      console.log('\nFinished SUCCESS')

      res.send({  result: 'success',items: items });
    }
  }
  
  /** Execute a query and receive line table metadata and rows. */
  queryApi.queryRows(fluxQuery, fluxObserver)
  

  console.log('xxxxxxxxxx')

  
};

