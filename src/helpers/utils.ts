import numeral from 'numeral'

import type { Food } from '@/hooks/useDB'

export const nutrientValue = (num: number, multiplier: number) =>
  numeral(num * multiplier).format('0,0')

export const createRenderKey = () => new Date().getTime().toString()

export const displayFoodQtyAndUnit = (food: Food): string => {
  const { qty, unit, multiplier } = food

  const space = /[a-z]/i.test(unit) ? '' : ' '
  const totalQty = qty * multiplier

  return `${totalQty.toFixed(2).replace('.00', '')}${space}${unit}`
}
