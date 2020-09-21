<script>
import { Line } from 'vue-chartjs'

export default {
  name: 'ChartLines',
  extends: Line,
  props: {
    labels: {
      type: Array,
      default () {
        return []
      }
    },
    values: {
      type: Array,
      default () {
        return []
      }
    },
    datasets: {
      type: Array,
      default () {
        return [
          {
            data: this.values
          }
        ]
      }
    }
  },
  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: this.labels,
      datasets: this.datasets
    }, {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: true
      }
    })
  }
}
</script>

<style scoped></style>
