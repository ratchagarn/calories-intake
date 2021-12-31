import { v4 as uuidv4 } from 'uuid'

import type { Food } from '@/hooks/useDB'

const foodPresetData: Food[] = [
  {
    id: uuidv4(),
    name: 'ข้าว 250g',
    kcal: 130,
    carb: 28,
    pro: 2,
    fat: 0,
    multiplier: 2.5,
  },
  {
    id: uuidv4(),
    name: 'หมูสันนอก 100g',
    kcal: 121,
    carb: 0,
    pro: 23,
    fat: 3,
    multiplier: 1,
  },
]

export default foodPresetData
