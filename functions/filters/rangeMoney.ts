import {RangeValue} from "~/@types/components/form/MoneyInputRange";

export default function (value: number, searchValue: RangeValue):boolean {
  let toReturn = true;

  const min = searchValue.min;
  const max = searchValue.max;
  const conditions = []

  if (min) {
    conditions.push(value >= min);
  }

  if (max) {
    conditions.push(value <= max);
  }

  conditions.forEach(cond => {
    if (!cond) {
      toReturn = false
    }
  })

  return toReturn;
}
