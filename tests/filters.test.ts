import {moneyFormatter} from "../plugins/filters/moneyFormatter";

type Mapper = [any, string]

const numbersMapper: Mapper[] = [
  [null, "0,00"],
  [undefined, "0,00"],
  [+"aa", "0,00"],
  [0, "0,00"],
  [0.0, "0,00"],
  [100, "100,00"],
  [1000, "1.000,00"],
  [123456, "123.456,00"],
  [10.2, "10,20"],
  [10.02, "10,02"],
  [10.1234, "10,12"],
  [10.1254, "10,13"],
  [10521.1246, "10.521,12"],
  [0.529699, "0,53"],
  [.569699, "0,57"],
  [.561699, "0,56"],
  [0., "0,00"],
]

const stringsMapper: Mapper[] = [
  ["", "0,00"],
  ["10", "10,00"],
  ["10,50", "10,50"],
  ["10.125", "10,13"],
  ["10.125,50", "10.125,50"],
  ["10,122", "10,12"],
  ["25.125.214,125", "25.125.214,13"],
  ["25.125214,1244", "25.125.214,12"],
  ["25125214.1254", "25.125.214,13"],
  ["10,1229", "10,12"],
  ["10,12987", "10,13"],
  [",12987", "0,13"],
  ["0,00987", "0,01"],
  ["0,03987", "0,04"],
  ["0,04987", "0,05"],
  ["0,04987asda", "0,05"],
  ["asdasd", "0,00"],
]

const britesMapper: Mapper[] = [
  [10.50, "11"],
  [10.46, "10"],
  [10., "10"],
  [10, "10"],
  [0.46, "0"],
  [.46, "0"],
  ["10.46", "10"],
  ["10.125", "10"],
  ["10.125,40", "10.125"],
  ["25.125.214,125", "25.125.214"],
  ["25.125214,1244", "25.125.214"],
  ["25125214.5555", "25.125.215"],
  ["10,50", "11"],
  ["10,122", "10"],
  ["10,1229", "10"],
  ["10,12987", "10"],
  [",12987", "0"],
]

const nullMapper: Mapper[] = [
  [null, ""],
  [undefined, ""],
  ["", ""],
  [0, ""],
  [0.0, ""],
  ["0", ""],
  ["0.00", ""],
  ["0.00125", ""],
  ["0.0000125", ""],
]

describe('Testing Numbers', () => {
  test.each(numbersMapper)('should convert %s to %s', (a, b) => {
    expect(moneyFormatter(a)).toBe(b);
  })
});

describe("Testing Strings", () => {
  test.each(stringsMapper)('should convert %p to %s', (a, b) => {
    expect(moneyFormatter(a)).toBe(b);
  })
})

describe("Testing Brites", () => {
  test.each(britesMapper)('should convert %p to %s', (a, b) => {
    expect(moneyFormatter(a, true)).toBe(b);
  })
})

describe("Testing allowNull", () => {
  test.each(nullMapper)('should convert %p to %p', (a, b) => {
    expect(moneyFormatter(a, false, true)).toBe(b);
  })
})
