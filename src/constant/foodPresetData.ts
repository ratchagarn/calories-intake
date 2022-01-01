import { v4 as uuidv4 } from 'uuid'

import type { Food } from '@/hooks/useDB'

import foods from './foods.json'

const foodPresetData: Food[] = foods.map((food) => ({
  ...food,
  id: uuidv4(),
  multiplier: 1,
}))

export default foodPresetData
