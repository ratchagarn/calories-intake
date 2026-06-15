import { v4 as uuidv4 } from 'uuid'

import type { Food } from '@/hooks/useDB'

import { foodDatabase } from './foodDatabase'

const foodPresetData: Food[] = foodDatabase.map((food) => ({
  ...food,
  id: uuidv4(),
  multiplier: 1,
}))

export default foodPresetData
