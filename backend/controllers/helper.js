const dayjs = require('dayjs');

/**
 * creates today's date in local time
 * @returns today's date as a string as 'YYYY-MM-DD'
 */
const dateNowInIsoString = () => {
    const localDate = dayjs().format('YYYY-MM-DD')
    // 2021-10-19
    return localDate;
}

/**
 * 
 * @param {string} dateString - the date string being checked
 * @returns true if the date follows the correct date regex format, false otherwise
 */
const isValidDate = (dateString) => {
  const regex = /^\d{4}\-\d{2}\-\d{2}$/;
  if (dateString != undefined && dateString.match(regex)) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
    dateNowInIsoString,
    isValidDate
}