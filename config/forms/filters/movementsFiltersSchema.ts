import { FormSchema } from '~/@types/FormSchema'
import Vue from 'vue'
import MovementTypes from '~/enums/MovementTypes'

function getMovementTypesList (this: Vue) {
  
  const list = MovementTypes.iterable.reduce((acc: any[], curr) => {
    let mustReturn = true
    
    if (mustReturn) {
      acc.push({
        value: curr.value,
        text: this.$t('enums.MovementTypes.' + curr.id),
        order: curr.order || 99
      })
    }
    
    return acc
  }, [])
  
  list.sort((a, b) => a.order - b.order)
  
  return list
}

export default function (this: Vue): FormSchema[] {
  
  return [
    {
      cols: {
        type: {
          label: 'movement-type',
          component: 'v-select',
          clearable: true,
          items: getMovementTypesList.call(this)
        },
        amount: {
          label: 'movement-amount',
          // componente range di prezzo.
          component: 'money-input-range',
          minLabel: 'filters-money-min',
          maxLabel: 'filters-money-max'
        },
        createdAt: {
          label: 'filters-creation-date',
          component: 'date-picker-range',
          range: true,
          startByYear: false
        }
        
      }
    }
  ]
  
}
