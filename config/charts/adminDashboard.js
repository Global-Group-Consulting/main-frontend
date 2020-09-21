import moment from 'moment'

function getMonths () {
  const iterations = 6
  const toReturn = []

  for (let i = 0; i < iterations; i++) {
    const month = moment().subtract(i, 'months').format('MMMM')

    toReturn.unshift(month)
  }

  return toReturn
}

export default {
  labels: getMonths(),
  datasets: [

    {
      label: 'charts.remained-interests',
      borderColor: '#39c8c8',
      backgroundColor: 'rgba(46, 193, 194, .9)',
      data: [20000, 21000, 22000, 18000, 19000, 15000]
    },
    {
      label: 'charts.outgoing-capital',
      borderColor: '#c83939',
      backgroundColor: 'rgba(195,56,53,.9)',
      data: [5000, 6000, 10000, 1000, 25000, 8000]
    },
    {
      label: 'charts.outgoing-interests',
      borderColor: '#d29539',
      backgroundColor: 'rgba(204,146,46, .9)',
      data: [2000, 1000, 0, 4000, 3000, 5000]
    },
    {
      label: 'charts.incoming-capital',
      borderColor: '#91c839',
      backgroundColor: 'rgba(140, 195, 43, .9)',
      data: [150000, 140000, 100000, 200000, 80000, 120000]
    },
  ]
}
