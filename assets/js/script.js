"use strict";
// this is module.js file.

export const weekDayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wendsday",
    "Thursday",
    "Friday",
    "Saturday"
];

export const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];

/**
 * @param {number} dataUnix Unix date in seconds
 * @param {number} timezone timeZone shift from UTC in seconds
 * @returns {string} Date String. formate: 'Sunday 10, Jan'
 */
export const getDate = function (dataUnix, timezone) {
    const date = new Date((dataUnix + timezone) * 1000);
    const weekDayName = weekDayNames[date.getUTCDay()];
    const monthName = monthNames[date.getUTCMonth()];


    return `${weekDayName} ${date.getUTCDate()}, ${monthName}`
}


/**
 * @param {number} timeUnix Unix time in seconds
 * @param {number} timezone timeZone shift from UTC in seconds
 * @returns {string} Date String. formate: 'HH:MM AM/PM' 
 */

export const getTime = function (timeUnix, timezone) {
    const date = new Date((timeUnix + timezone) * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';

    return `${hours % 12 || 12}:${minutes} ${period}`
}

/**
 * @param {number} timeUnix Unix time in seconds
 * @param {number} timezone timeZone shift from UTC in seconds
 * @returns {string} Date String. formate: 'HH AM/PM' 
 */

export const getHours = function (timeUnix, timezone) {
    const date = new Date((timeUnix + timezone) * 1000);
    const hours = date.getUTCHours();
    const period = hours >= 12 ? 'PM' : 'AM';

    return `${hours % 12 || 12} ${period}`
}


/**
 * @param {number} mps metter per seconds
 * @returns  {number} killometer per hours
 */

export const mps_to_kmh = mps => {
    const mph = mps * 3600;
    return mph / 1000;
}

export const aqiText = {
    1: {
        level: "Good",
        message: "Air quality is considered satisfactory and ar pollution poses little or no risk",
    },
    2: {
        level: "Fair",
        message: "Air quality is acceprable; however, for some pollutants there may be moderate health concern for very small number of people who are unusually sensitive to air pollution."

    },
    3: {
        level: "Moderate",
        message: "Members of sensitive groups may expreince health effects. The general public is not likely to be affected."
    },
    4: {
        level: "Poor",
        message: "Everyone mey begin to expreince health effects; members of sensitive groups may experience more serious health effects."
    },
    5: {
        level: "Very Poor",
        message: "Health warnings pf emergency conditions. The entire polution is more likely to be affected."
    }
}