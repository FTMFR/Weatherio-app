"use strict";


import { fetchDataFromServer, url } from "./global.js";
import * as module from "./script.js";

/**
 * 
 * @param {NodeList} elements elements node array
 * @param {string} eventType event type : 'click' ,'mouseover'
 * @param {Function} callback callback function
 */


const addEventOnElement = function (elements, eventType, callback) {
    for (const element of elements) {
        element.addEventListener(eventType, callback);
    }
}


/**
 * toggle search in mobile device
 */

const searchView = document.querySelector("[data-search-view]");
const searchToggler = document.querySelectorAll('[data-search-toggler]');
const togglerSearch = () => {
    searchView.classList.toggle('active');
}
console.log(searchView, searchToggler)
addEventOnElement(searchToggler, 'click', togglerSearch);

/**
 * search integration
 */

const searchFields = document.querySelector('[data-search-field]');
const searchResult = document.querySelector('[data-search-result]');
console.log(searchFields)

let searchTimeout = null;
let searchTimeoutDuration = 500;


searchFields.addEventListener('input', function () {
    searchTimeout ?? clearTimeout(searchTimeout);
    if (searchFields.value) {
        searchResult.classList.remove('active');
        searchResult.innerHTML = '';
        searchFields.classList.remove('searching');
    } else {
        searchFields.classList.add('searching')
    }

    if (searchFields.value) {
        searchTimeout = setTimeout(() => {
            fetchDataFromServer(url.geo(searchFields.value), function (locations) {
                  // {names: locations}
                    searchFields.classList.remove('searching');
                    searchResult.classList.add('active');
                    searchResult.innerHTML = `
                            <ul class="view-list" data-search-list></ul>`;

                    /**
                     * {nodeList} | []
                     */
                    const items = [];
                    for (const { name, lat, lon, country, state } of locations) {
                        const searchItem = document.createElement('li');
                        searchItem.classList.add('view-item');

                        searchItem.innerHTML = `        
                                    <span class="m-icon">location_on</span>
                                    <div>
                                        <p class="item-title">${name}</p>
                                        <p class="label-2 item-subtitle">${state || ''} ${country} </p>
                                    </div>
                                    <a href="#/weather?lat=${lat}&lon=${lon}" aria-label="${name} weather" class="item-link has-state" data-search-toggler></a>
                            `;

                        searchResult.querySelector("[data-search-list]").appendChild(searchItem);
                        items.push(searchItem.querySelector("[data-search-toggler]"))
                      }

                    addEventOnElement(items, 'click', function () {
                        togglerSearch();
                        searchResult.classList.remove('active')
                    })
                })
        }, searchTimeoutDuration);
    }
})

const container = document.querySelector('[data-container]');
const loading = document.querySelector('[data-loading]');
const currentLocationBtn = document.querySelector('[data-current-location-btn]');
const errorContent = document.querySelector("[data-error-content]");


/**
 * 
 * @param {number} lat latitude 
 * @param {number} lon logitude
 */
export const updateWeather = function (lat, lon) {
    loading.style.display ='grid';
    loading.style.overflowY = 'hidden';
    container.classList.remove('fade-in');
    errorContent.style.display = 'none';

    const currentWeatherSection = document.querySelector('[data-search-weather]');
    const highlightSection = document.querySelector('[data-hightlights]');
    const hourlyForecast = document.querySelector('[data-hourly-forecast');
    const forecastSection = document.querySelector('[data-5-day-forecast]');


    currentWeatherSection.innerHTML = '';
    highlightSection.innerHTML = '';
    hourlyForecast.innerHTML = '';
    forecastSection.innerHTML = '';

    if (window.location.hash === '#/current-location') {
        currentLocationBtn.setAttribute("disabled", "");
    } else {
        currentLocationBtn.removeAttribute('disabled');
    }

    /**
     * current weather section
     */

    fetchDataFromServer(url.currentWeather(lat, lon), function (currentWeather) {
        const {
            weather,
            dt: dataUnix,
            sys: { sunrise: sunrisesUnixUTC, sunset: sunsetUnixUTC },
            main: { temp, feels_like, pressure, humidity },
            visibility,
            timezone
        } = currentWeather;
        const [{ description, icon }] = weather;

        const card = document.createElement('div');
        card.classList.add('card', 'card-lg', 'current-weather-card');
        card.innerHTML = `
                    <h2 class="title-2 card-title">Now</h2>
                    <div class="weapper">
                    <p class="heading">${parseInt(temp)}&deg;<sup>c</sup></p>
                    <img
                        class="weather-icon"
                        src="assets/images/weather_icons/${icon}.png"
                        alt="${description}"
                        width="64"
                        height="64"
                    />
                    </div>
                    <p class="body-30">${description}</p>
                    <ul class="meta-list">
                    <li class="meta-item">
                        <span class="m-icon">calendar_today</span>
                        <p class="title-3 meta-text">${module.getDate(dataUnix, timezone)}</p>
                    </li>

                    <li class="meta-item">
                        <span class="m-icon">location_on</span>
                        <p class="title-3 meta-text" data-location></p>
                    </li>
                    </ul>
        `;

        fetchDataFromServer(url.reverseGeo(lat, lon), function ([{ name, country }]) {
            card.querySelector("[data-location]").innerHTML = `
            ${name}, ${country}`;
        })

        currentWeatherSection.appendChild(card);

        /**
         * todays highlights
         */

        fetchDataFromServer(url.airPolution(lat, lon), function (airPolution) {
            const [{
                main: { aqi },
                components: { no2, o3, so2, pm2_5 }
            }] = airPolution.list;

            const card = document.createElement('div');
            card.classList.add('card', 'card-lg');

            card.innerHTML = `
            <h2 class="title-2" id="highlight-label">Today Highlights</h2>
            <div class="highlight-list">
              <div class="card card-sm highlight-card one">
                <h3 class="title-3">Air Quality index</h3>
                <div class="wrapper">
                  <span class="m-icon">air</span>
                  <ul class="card-list">
                    <li class="card-item">
                      <p class="title-1">${pm2_5.toPrecision(3)}</p>
                      <p class="label-1">PM <sub>2.5</sub></p>
                    </li>
                    <li class="card-item">
                      <p class="title-1">${so2.toPrecision(3)}</p>
                      <p class="label-1">PM <sub>2.5</sub></p>
                    </li>
                    <li class="card-item">
                      <p class="title-1">${no2.toPrecision(3)}</p>
                      <p class="label-1">PM <sub>2.5</sub></p>
                    </li>
                    <li class="card-item">
                      <p class="title-1">${o3.toPrecision(3)}</p>
                      <p class="label-1">PM <sub>2.5</sub></p>
                    </li>
                  </ul>
                </div>
                <span class="badge aqi-${aqi} label-${aqi}" title="${module.aqiText[aqi].message}"
                  >${module.aqiText[aqi].level}</span
                >
              </div>
              <div class="card card-sm highlight-card two">
                <h3 class="title-3">Sunrise & Sunset</h3>
                <div class="card-list">
                  <div class="card-item">
                    <span class="m-icon">clear_day</span>
                    <div>
                      <p class="label-1">Sunrise</p>
                      <p class="title-1">${module.getTime(sunrisesUnixUTC, timezone)}</p>
                    </div>
                  </div>
                  <div class="card-item">
                    <span class="m-icon">clear_night</span>
                    <div>
                      <p class="label-1">Sunset</p>
                      <p class="title-1">${module.getTime(sunrisesUnixUTC, timezone)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card card-sm highlight-card">
                <h3 class="title-3">Humidity</h3>
                <div class="wrapper">
                  <span class="m-icon">humidity_percentage</span>
                  <p class="title-1">${humidity} <sub>%</sub></p>
                </div>
              </div>

              <div class="card card-sm highlight-card">
                <h3 class="title-3">Pressure</h3>
                <div class="wrapper">
                  <span class="m-icon">airwave</span>
                  <p class="title-1">${pressure} <sub>hPa</sub></p>
                </div>
              </div>

              <div class="card card-sm highlight-card">
                <h3 class="title-3">Visibility</h3>
                <div class="wrapper">
                  <span class="m-icon">visibility</span>
                  <p class="title-1">${visibility} <sup>km</sup></p>
                </div>
              </div>

              <div class="card card-sm highlight-card">
                <h3 class="title-3">Feels like</h3>
                <div class="wrapper">
                  <span class="m-icon">thermostate</span>
                  <p class="title-1">${parseInt(feels_like)}&deg; <sub>c</sub></p>
                </div>
              </div>
            </div>
            `;

            highlightSection.appendChild(card);
        });

        /**
         * 24 forecast sectiob
         */

        fetchDataFromServer(url.forecast(lat, lon), function (forecast) {
            const {
                list: forecastList,
                city: { timezone }
            } = forecast;

            hourlyForecast.innerHTML = `
            <h2 class="title-2">Today at</h2>
            <div class="slider-container">
              <ul class="slider-list" data-temp></ul>
              <ul class="slider-list" data-wind></ul>
            </div>
            `;

            for (const [index, data] of forecastList.entries()) {
                if (index > 7) break;
                const {
                    dt: dataTimeUnix,
                    main: { temp },
                    weather,
                    wind: { deg: windDirection, speed: windSpeed }
                } = data;

                const [{ icon, description }] = weather;

                const tempLi = document.createElement('li');
                tempLi.classList.add('slider-item');
                tempLi.innerHTML = `
                        <div class="card card-sm slider-card">
                        <p class="body-3">${module.getHours(dataTimeUnix, timezone)}</p>
                        <img
                        src="assets/images/weather_icons/${icon}.png"
                        alt="${description}"
                        class="weather-icon"
                        title="${description}"
                        loading="lazy"
                        width="48"
                        height="48"
                        />
                        <p class="body-3">${parseInt(temp)}&deg;</p>
                        </div>`;


                hourlyForecast.querySelector('[data-temp]').appendChild(tempLi);

                const windLi = document.createElement('li');
                windLi.classList.add('slider-item');

                windLi.innerHTML = `
                <div class="card card-sm slider-card">
                <p class="body-3">${module.getHours(dataTimeUnix, timezone)}</p>
                <img
                  src="assets/images/weather_icons/direction.png"
                  alt=""
                  class="weather-icon"
                  loading="lazy"
                  width="48"
                  height="48"
                  style="transform: rotate(${windDirection - 180}deg)"
                />
                <p class="body-3">${parseInt(module.mps_to_kmh(windSpeed))} km</p>
                </div>
                `;

                hourlyForecast.querySelector('[data-wind]').appendChild(windLi);

            };

            /**
             * 5days forecast section
             */
            forecastSection.innerHTML = `
                    <h2 class="title-2" id="forecast-label">5 Days Forecast</h2>
                    <div class="card-lg forecast-card">
                    <ul data-forecast-list>
                    </ul>
                    </div>`;

            for (let i = 7; i < forecastList.length; i += 8) {
                const {
                    main: { temp_max },
                    weather,
                    dt_txt
                } = forecastList[i];

                const [{ icon, description }] = weather;
                const date = new Date(dt_txt);

                const li = document.createElement('li');
                li.classList.add('card-item');
                li.innerHTML = `
                <div class="icon-wrapper">
                <img
                src="assets/images/weather_icons/${icon}.png"
                width="36"
                height="36"
                class="weather-icon"
                alt="${description}"
                title="${description}"
                />
                <span class="span">
                <p class="title-2">${parseInt(temp_max)}&deg;</p>
                </span>
                </div>
                <p class="label-1">${date.getDate()} ${module.monthNames[date.getUTCMonth()]}</p>
                <p class="label-1">${module.weekDayNames[date.getUTCDay()]}</p>
                `;

                forecastSection.querySelector('[data-forecast-list]').appendChild(li);

            }

            loading.style.display ='none';
            loading.style.overflowY = 'overlay';
            container.classList.add('fade-in');

        });

    })

}

export const error404 = function () {
errorContent.style.display ='flex';
}