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

export type FoodState = 'RAW' | 'COOKED' | 'UNKNOWN'

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

/**
 * แปลงข้อมูล Food และสั่ง Download เป็นไฟล์ JSON
 * @param data Array ของข้อมูล Food ที่ต้องการ export
 * @param fileName ชื่อไฟล์ที่ต้องการ (ไม่ต้องใส่ .json)
 */
export const exportFoodsToJSON = (
  data: Food[],
  fileName: string = 'food-export'
): void => {
  try {
    // 1. แปลง Object เป็น JSON String (ใส่ space 2 ช่องเพื่อให้อ่านง่ายเมื่อเปิดดูไฟล์)
    const jsonString = JSON.stringify(data, null, 2)

    // 2. สร้าง Blob Object กำหนด Type เป็น application/json
    const blob = new Blob([jsonString], { type: 'application/json' })

    // 3. สร้าง Object URL ชั่วคราวจาก Blob
    const url = URL.createObjectURL(blob)

    // 4. สร้าง <a> element จำลองขึ้นมาเพื่อใช้ trigger ดาวน์โหลด
    const link = document.createElement('a')
    link.href = url
    link.download = `${fileName}.json`

    // 5. Append เข้า DOM ชั่วคราว, สั่ง Click และลบออกทันที
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // 6. เคลียร์ Object URL ออกจากหน่วยความจำเพื่อป้องกัน Memory Leak
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to export food data to JSON:', error)
  }
}
