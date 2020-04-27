const express = require('express')
const { downloadAndParse } = require('./api')
const moment = require('moment')

async function run() {

    let locations = await downloadAndParse()

    setInterval(async() => {
        locations = await downloadAndParse()
        console.log('Adatok frissítve', moment().format())

    }, 1000*60*60)

    const app = express()
    app.get('/', (req,res) => {
        res.send('Welcome')
    })

    app.get('/locations', (req,res) => {
        res.json(locations)
    })
    
    app.listen(8080, () => {
        console.log('Webserver fut')
    })
}

run()

