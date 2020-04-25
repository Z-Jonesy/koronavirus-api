const axios = require('axios').default
const moment = require('moment')
const parse = require('csv-parse')
const { promisify } = require('util')

const URL = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/{date}.csv'

async function download() {
    const yesterday = moment().subtract(1,'day').format('MM-DD-YYYY')
    const response = await axios.get(URL.replace('{date}', yesterday))
    return response.data
}

const parseAsync = promisify(parse) 
async function parseData(data){
    const records = await parseAsync(data, { from_line: 2 })
    /*const locations = records.map(([state, country, last_Update, confirmed, deaths, recovered, latitude, longitude]) => ({
        state,
        country,
        last_Update,
        confirmed: parseInt(confirmed),
        deaths: parseInt(deaths),
        recovered: parseInt(recovered),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
        })        
    )
    return locations*/

    /*const locations = records.map(([Province_State,Country_Region,Last_Update,Lat,Long_,Confirmed,Deaths,Recovered,Active]) => ({
        Province_State,
        Country_Region,
        Confirmed: parseInt(Confirmed),
        Last_Update,Lat,Long_,Confirmed,Deaths,Recovered,Active
    })) */
        const locations = records.map(([state, country, lastUpdate, confirmed, deaths, recovered, latitude, longitude]) => ({
        state,
        country,
        confirmed: parseInt(confirmed),
        deaths: parseInt(deaths),
        recovered: parseInt(recovered),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
    })) 

    return locations

}

async function downloadAndParse(){
    const data = await download()
    const locations = await parseData(data)
    return locations
}

downloadAndParse().then(console.log)

module.exports = {
    download,
    parseData,
    downloadAndParse
}