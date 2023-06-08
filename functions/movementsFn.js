import { ref } from "@vue/composition-api"
import MovementTypes from "@/enums/MovementTypes"

/**
 * @param {{
 *  $apiCalls: import("../plugins/apiCalls").ApiCalls
 * }} param0
 */
export default function ({ $apiCalls, $set, $options, $i18n }) {
  /**
     *@type {{value:IMovement[]}}
     */
  const movementsList = ref([]);

  /**
   *@param {IMovement} item
   */
  function formatAmountChange(item) {
    const sign = [
      MovementTypes.INTEREST_COLLECTED,
      MovementTypes.DEPOSIT_COLLECTED,
      MovementTypes.COMMISSION_COLLECTED
    ].includes(item.movementType)
      ? "-"
      : "+";
    const color = sign === "-" ? "red--text" : "green--text";

    return `<span class="text-no-wrap ${color}">€ ${sign}${$options.filters.moneyFormatter(
      item.amountChange.toFixed(2)
    )}</span>`;
  }

  /**
   *@param {IMovement} item
   */
  function formatMovementType(item) {
    const movementId = MovementTypes.get(item.movementType).id;
    const text = $i18n.t(`enums.MovementTypes.${movementId}`);

    if (item.movementType === MovementTypes.INTEREST_RECAPITALIZED) {
      return `<strong>${text}</strong>`;
    }

    return text;
  }

  /**
   *@param {IMovement} item
   */
  function getItemClass(item) {
    if (item.movementType === MovementTypes.INTEREST_RECAPITALIZED) {
      return "yellow lighten-5";
    }
  }

  async function fetchMovementsList(userId) {
    const data = await $apiCalls.movementApi.fetchMovementsList(userId);

    $set(movementsList, "value", data.data);
  }

  return {
    list: movementsList,
    fetchList: fetchMovementsList,
    formatAmountChange,
    formatMovementType,
    getItemClass
  }
}
