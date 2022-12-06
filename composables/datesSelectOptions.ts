import moment from 'moment'

export function useDatesSelectOptions () {
  const format = 'YYYY-MM-DD'
  
  function getCurrentMonthDates () {
    const currDate = moment()
    const currMonth = currDate.date() >= 16 ? currDate.month() : currDate.month() - 1
    const startDate = moment().month(currMonth).date(16)
    const endDate = moment().month(currMonth + 1).date(15)
    
    return {
      start: startDate,
      end: endDate
    }
  }
  
  function getSelectableDates () {
    const currMonth = getCurrentMonthDates()
    const startDate = currMonth.start
    const endDate = currMonth.end
    
    return [
      {
        value: [startDate.format(format), endDate.format(format)],
        text: 'Mese Corrente'
      }, {
        value: [startDate.clone().subtract(1, 'month').format(format), endDate.clone().subtract(1, 'month').format(format)],
        text: 'Mese Scorso'
      }, {
        value: [startDate.clone().subtract(3, 'month').format(format), endDate.clone().format(format)],
        text: 'Ultimi 3 mesi'
      }, {
        value: [startDate.clone().subtract(6, 'month').format(format), endDate.clone().format(format)],
        text: 'Ultimi 6 mesi'
      }, {
        value: [startDate.clone().subtract(12, 'month').format(format), endDate.clone().format(format)],
        text: 'Ultimo anno'
      }, {
        value: [startDate.clone().subtract(24, 'month').format(format), endDate.clone().format(format)],
        text: 'Ultimi 2 anni'
      }
    ]
  }
  
  return {
    format,
    getSelectableDates,
    getCurrentMonthDates
  }
}
