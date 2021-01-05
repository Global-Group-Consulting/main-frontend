import moment from 'moment'
import { upperFirst } from "lodash"

function getMonths(data) {
  const iterations = 12
  const toReturn = []

  for (let i = 0; i < data.length && i < iterations; i++) {
    if (i > iterations) {
      break;
    }

    const month = moment(data[i].created_at).format('MMMM-YY')

    toReturn.unshift(upperFirst(month))
  }

  return toReturn
}

export default {
  labels: getMonths,
  datasets: [
    {
      display: true,
      id: 'deposit',
      borderColor: '#91c839',
      // backgroundColor: 'rgba(140, 195, 43, .9)',
      data: []
    },
    {
      id: 'interestAmount',
      borderColor: '#39c8c8',
      // backgroundColor: 'rgba(46, 193, 194, .9)',
      data: []
    },
    /*
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
    }, */
  ]
}
