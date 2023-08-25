// this is api.js file.
const api_key = '081c576429226e4c22771341a65ca64e';


/**
 * @param {string} URL API url
 * @param {function} callback callback
 */

export const fetchDataFromServer = function (URL, callback) {
    fetch(`${URL}&appid=${api_key}`).then(res => res.json())
        .then(data => callback(data)).catch(err => console.log('err: ' + err));
}

export const url = {
    currentWeather(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=metric`
    },
    forecast(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric`
    },
    airPolution(lat, lon) {
        return `http://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}`
    },
    reverseGeo(lat, lon) {
        return `http://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=5`
    },
    /**
     * 
     * @param {string} query search query: 'London', 'new york;
     * @returns 
     */
    geo(query) {
        return `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`
    }
}
