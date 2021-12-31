import numeral from 'numeral'

export const NutrientValue = (num: number, multiplier: number) =>
  numeral(num * multiplier).format('0,0')

export const createRenderKey = () => new Date().getTime().toString()
