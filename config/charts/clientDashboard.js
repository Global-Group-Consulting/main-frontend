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
      label: 'charts.current-deposit',
      borderColor: '#91c839',
      backgroundColor: 'rgba(140, 195, 43, .9)',
      data: [2000, 2100, 2200, 1800, 1900, 1500]
    },
    {
      label: 'charts.current-interests',
      borderColor: '#39c8c8',
      backgroundColor: 'rgba(46, 193, 194, .9)',
      data: [200, 210, 220, 180, 190, 150]
    },
    {
      label: 'charts.picket-deposit',
      borderColor: '#c83939',
      backgroundColor: 'rgba(195,56,53,.9)',
      data: [200, 0, 0, 400, 0, 300]
    },
    {
      label: 'charts.picked-interests',
      borderColor: '#d29539',
      backgroundColor: 'rgba(204,146,46, .9)',
      data: [0, 0, 0, 40, 0, 30]
    },
  ]
}
