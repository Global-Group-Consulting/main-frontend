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
      label: 'charts.gained-provisions',
      borderColor: '#91c839',
      backgroundColor: 'rgba(140, 195, 43, .9)',
      data: [800, 900, 1100, 800, 900, 500]
    },
    {
      label: 'charts.invested-provisions',
      borderColor: '#39c8c8',
      backgroundColor: 'rgba(46, 193, 194, .9)',
      data: [200, 210, 220, 0, 190, 300]
    },
    {
      label: 'charts.picket-provisions',
      borderColor: '#c83939',
      backgroundColor: 'rgba(195,56,53,.9)',
      data: [0, 0, 0, 250, 0, 150]
    },
  ]
}
