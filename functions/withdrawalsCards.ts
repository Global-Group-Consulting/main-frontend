import RequestDialog from '~/components/dialogs/RequestDialog.vue';
import RequestDialogGold from '~/components/dialogs/RequestGoldDialog.vue';
import { computed, ComputedRef, Ref, ref } from '@vue/composition-api';

export interface WithdrawalCardsData {
  cardsRequestMinAmount: ComputedRef<number>,
  cardsHasErrors: Ref<string>,
  onBack: () => void,
  onWithdrawalCardsInput: (value: any[]) => void,
  checkBeforeSubmit: () => boolean
}

export default function withdrawalCards (this: RequestDialog | RequestDialogGold, amountKey: "amount" | "requestAmount" = "amount"): WithdrawalCardsData {
  let dialog = this;
  const cardsHasErrors: any = ref(null);

  const cardsRequestMinAmount = computed(() => {
    return dialog.$store.getters["settings/globalSettings"].cardsRequestMinAmount
  })

  const onBack = () => {
    if (dialog.currentStep > 0) {
      dialog.currentStep--
    } else {
      if (dialog instanceof RequestDialogGold) {
        dialog.onClose()
      } else {
        dialog.close()
      }
    }
  }

  const onWithdrawalCardsInput = (value: any[]) => {
    dialog.formData.cards = value
  }

  const checkBeforeSubmit = () => {
    let toReturn = true

    // @ts-ignore
    if (dialog.formData[amountKey] && cardsRequestMinAmount.value >= dialog.formData[amountKey]) {
      if (dialog.currentStep === 0) {
        dialog.currentStep++;
        toReturn = false
      } else if (cardsHasErrors.value || !dialog.formData.cards) {
        toReturn = false
        // @ts-ignore
      } else if (dialog.formData.cards && dialog.formData.cards.reduce((acc, curr) => acc + curr.amount, 0) !== dialog.formData[amountKey]) {
        toReturn = false
      }
    }

    return toReturn
  }

  return {
    cardsRequestMinAmount,
    cardsHasErrors,
    onBack,
    onWithdrawalCardsInput,
    checkBeforeSubmit
  }
}

