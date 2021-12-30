import numeral from 'numeral'

export const NutrientValue = (num: number, multiple: number) =>
  numeral(num * multiple).format('0,0')
