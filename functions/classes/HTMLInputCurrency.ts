import Cleave from "cleave.js";

export interface HTMLInputCleave extends HTMLInputElement {
  cleave: Cleave
}

export class HTMLInputCurrency {
  protected input: HTMLInputCleave;
  protected cleave: Cleave;

  constructor(input: HTMLInputElement) {
    this.input = input as HTMLInputCleave;

    this.cleave = new Cleave(this.input, {
      numeral: true,
      delimiter: '.',
      numeralPositiveOnly: true,
      numeralDecimalMark: ',',
      numeralDecimalScale: 2
    })

    this.input.cleave = this.cleave;

    this.addListeners();
  }

  private addListeners() {
    this.input.addEventListener("keydown", (e: KeyboardEvent) => this.onKeyDown(e))
    this.input.addEventListener("blur", (e: FocusEvent) => this.onBlur(e))
  }

  protected onKeyDown(e: KeyboardEvent) {
    if (e.key === ".") {
      e.preventDefault()

      const target: HTMLInputElement = e.target as HTMLInputElement;

      if (!target) {
        return
      }

      if (!target.value?.includes(",")) {
        target.value += ",";
      }
    }
  }

  protected onBlur(e: FocusEvent) {
    const target: HTMLInputElement = e.target as HTMLInputElement;

    if (!target) {
      return
    }

    let value: string = target.value

    if (value === "") {
      value = "0,00"
    }

    if (!value.includes(",")) {
      value += ",";
    }

    let decimals = value.slice(value.indexOf(","))

    while (decimals.length <= 2) {
      value += "0";

      decimals = value.slice(value.indexOf(","));
    }

    if (value !== target.value) {
      target.value = value;
    }
  }
}
