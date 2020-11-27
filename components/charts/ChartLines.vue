<script>
import { Line } from "vue-chartjs";

export default {
  name: "ChartLines",
  extends: Line,
  props: {
    labels: {
      type: Array,
      default() {
        return [];
      }
    },
    values: {
      type: Array,
      default() {
        return [];
      }
    },
    datasets: {
      type: Array,
      default() {
        return [
          {
            data: this.values
          }
        ];
      }
    }
  },
  methods: {
    renderAll() {
      // Overwriting base render method with actual data.
      this.renderChart(
        {
          labels: this.labels,
          datasets: this.datasets
        },
        {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: true
          },
          tooltips: {
            callbacks: {
              label: (tooltipItem, obj) => {
                const value = this.$options.filters.moneyFormatter(
                  +tooltipItem.value
                );

                return (
                  obj.datasets[tooltipItem.datasetIndex].label + ": € " + value
                );
              }
            }
          }
        }
      );
    }
  },
  mounted() {
    this.renderAll();
  },
  watch: {
    labels() {
      this.renderAll();
    },
    datasets() {
      this.renderAll();
    }
  }
};
</script>

<style scoped></style>
