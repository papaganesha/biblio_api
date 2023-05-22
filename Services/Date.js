
const addWeeksToDate = (dateObj, numberOfWeeks) => {
    dateObj.setDate(dateObj.getDate() + numberOfWeeks * 7)
    return dateObj
}


const treatAsUTC = (date) => {
    var result = new Date(date)
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset())
    return result
}

const daysBetween = (startDate, endDate) => {
    var millisecondsPerDay = 24 * 60 * 60 * 1000
    return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay
}

//console.log(daysBetween('2023-05-15 15:26:32', '2023-05-17 15:26:32'))
// console.log(daysBetween( '2023-05-17 15:26:32', '2023-05-15 15:26:32'))


module.exports = { addWeeksToDate, daysBetween }

//   const numberOfWeeks = 2
//   console.log(addWeeksToDate(new Date(), 2).toISOString())