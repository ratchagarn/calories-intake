import { v4 as uuidv4 } from 'uuid'

import { foodDatabase } from './foodDatabase'

export interface FoodPreset extends Food {
  id: string
  multiplier: number
}

export const foodPresetData: FoodPreset[] = foodDatabase.map((food) => ({
  ...food,
  id: uuidv4(),
  multiplier: 1,
}))

export type FoodState = 'RAW' | 'COOKED'

export interface Food {
  name: string
  qty: number
  state: FoodState
  unit: string
  carb: number
  pro: number
  fat: number
  kcal: number
}

export function f(
  name: Food['name'],
  qty: string, // ตัวอย่าง: "100g", "2แผ่น"
  state: Food['state'],
  nutrients: string // ตัวอย่าง: "120:28|2|0" -> kcal:carb|pro|fat
): Food {
  // แยกตัวเลขออกจากหน่วยนับด้วย Regex
  const qtyMatch = qty.match(/^(\d+)(.*)$/)
  const qtyNum = qtyMatch ? parseInt(qtyMatch[1], 10) : 0
  const unitStr = qtyMatch ? qtyMatch[2].trim() : ''

  // แยกส่วนของ Kcal และ Macros
  const [kcalStr, macrosStr] = nutrients.split(':')
  const [carbStr, proStr, fatStr] = macrosStr.split('|')

  return {
    name,
    qty: qtyNum,
    unit: unitStr,
    state,
    carb: parseInt(carbStr, 10),
    pro: parseInt(proStr, 10),
    fat: parseInt(fatStr, 10),
    kcal: parseInt(kcalStr, 10),
  }
}
