import numeral from 'numeral'

import type { FoodDB } from '@/hooks/useDB'

export const nutrientValue = (num: number, multiplier: number) =>
  numeral(num * multiplier).format('0,0')

export const createRenderKey = () => new Date().getTime().toString()

export const displayFoodQtyAndUnit = (food: FoodDB): string => {
  const { qty, unit, multiplier } = food

  const space = /[a-z]/i.test(unit) ? '' : ' '
  const totalQty = qty * multiplier

  return `${totalQty.toFixed(2).replace('.00', '')}${space}${unit}`
}

export interface MacroInput {
  carb: string | number
  pro: string | number
  fat: string | number
}

export const calculateKCAL = ({ carb, pro, fat }: MacroInput): number => {
  const sanitizeInput = (value: string | number): number => {
    const parsed = Number(value)
    return isNaN(parsed) || parsed < 0 ? 0 : parsed
  }

  const cleanCarb = sanitizeInput(carb)
  const cleanPro = sanitizeInput(pro)
  const cleanFat = sanitizeInput(fat)

  return cleanCarb * 4 + cleanPro * 4 + cleanFat * 9
}
