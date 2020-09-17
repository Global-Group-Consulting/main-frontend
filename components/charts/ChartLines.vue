<script>
  import { Line } from 'vue-chartjs'

  export default {
    name:    'ChartLines',
    extends: Line,
    props:   {
      labels: {
        type:    Array,
        default: []
      },
      values: {
        type:    Array,
        default: []
      }
    },
    mounted () {
      // Overwriting base render method with actual data.
      this.renderChart({
        labels:   this.labels,
        datasets: [
          {
            // label:           'GitHub Commits',
            // backgroundColor: '#f87979',
            data: this.values
          }
        ]
      }, {
        responsive:          true,
        maintainAspectRatio: false,
        legend:              {
          display: false
        }
      })
    }
  }
</script>

<style scoped></style>
