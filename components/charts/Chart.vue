<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  data () {
    return {
      chartdata: {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        datasets: [
          {
            label: this.label,
            backgroundColor: this.color,
            data: [100000, 105000, 103000, 90000, 110000, 103000, 98000, 92000]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
  props: {
    label: String,
    color: {
      type: String,
      default: '#8ef879'
    }
  },
  mounted () {
    this.renderChart(this.chartdata, this.options)
  }
}

</script>

<style scoped>

</style>
