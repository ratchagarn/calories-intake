import type { ReactNode } from 'react'

import { createContext, useContext, useState } from 'react'
import store from 'store'
import dayjs from 'dayjs'
import { FoodPreset } from '@/constant/foodPresetData'

export interface FoodDB extends FoodPreset {
  updatedAt?: string
}

export interface Settings {
  numberKeyboardPreview: boolean
  displayLatestUpdate: boolean
}

const key = {
  targetCaloriesIntake: 'targetCaloriesIntake',
  foods: 'foods',
  settings: 'settings',
  latestUpdate: 'latestUpdate',
}

const defaultTargetCaloriesIntake = 2000

export const defaultSettings: Settings = {
  numberKeyboardPreview: true,
  displayLatestUpdate: true,
}

export const dbIsExists = () =>
  store.get(key.targetCaloriesIntake) != null &&
  store.get(key.foods) != null &&
  store.get(key.settings) != null &&
  store.get(key.latestUpdate) != null

export const createDB = () => {
  !store.get(key.targetCaloriesIntake) &&
    store.set(key.targetCaloriesIntake, defaultTargetCaloriesIntake)
  !store.get(key.foods) && store.set(key.foods, [])
  !store.get(key.settings) && store.set(key.settings, defaultSettings)
  !store.get(key.latestUpdate) && store.set(key.latestUpdate, '')
}

interface DBContextType {
  targetCaloriesIntake: number
  updateTargetCaloriesIntake: (kcal: number) => void
  foods: FoodDB[]
  addFood: (food: FoodDB) => void
  updateFood: (newValue: FoodDB) => void
  deleteFood: (id: string) => void
  clearAllFoods: VoidFunction
  getTotalCaloriesIntake: () => number
  settings: Settings
  updateSettings: (newSettings: Settings) => void
  restoreSettings: VoidFunction
  latestUpdate: string
}

const DBContext = createContext<DBContextType>(null!)

export function DBProvider({ children }: { children: ReactNode }) {
  const [targetCaloriesIntake, setTargetCaloriesIntake] = useState<number>(
    store.get(key.targetCaloriesIntake) || defaultTargetCaloriesIntake
  )
  const [foods, setFoods] = useState<FoodDB[]>(store.get(key.foods) || [])
  const [settings, setSettings] = useState<Settings>(
    store.get(key.settings) || {}
  )
  const [latestUpdate, setLatestUpdate] = useState<string>(
    store.get(key.latestUpdate) || ''
  )

  const getCurrentTime = () => dayjs().format()

  const setNewLatestUpdate = () => {
    const currentTime = getCurrentTime()

    store.set(key.latestUpdate, currentTime)
    setLatestUpdate(currentTime)
  }

  const updateTargetCaloriesIntake = (kcal: number) => {
    setTargetCaloriesIntake(kcal)
    store.set(key.targetCaloriesIntake, kcal)
  }

  const value = {
    targetCaloriesIntake,
    updateTargetCaloriesIntake,
    foods,
    addFood: (food: FoodDB) => {
      const newFoods = foods.concat([food])

      store.set(key.foods, newFoods)
      setFoods(newFoods)
      setNewLatestUpdate()
    },
    updateFood: (newValue: FoodDB) => {
      const updateFoods = foods.map((food) => {
        return food.id === newValue.id
          ? {
              ...newValue,
              updatedAt: getCurrentTime(),
            }
          : food
      })

      store.set(key.foods, updateFoods)
      setFoods(updateFoods)
      setNewLatestUpdate()
    },
    deleteFood: (id: string) => {
      const updateFoods = foods.filter((food) => {
        return food.id !== id
      })

      store.set(key.foods, updateFoods)
      setFoods(updateFoods)
      setNewLatestUpdate()
    },
    getTotalCaloriesIntake: () => {
      let result = 0

      foods.forEach((food) => {
        result += food.kcal * food.multiplier
      })

      return result
    },
    clearAllFoods: () => {
      store.set(key.foods, [])
      setFoods([])
      setLatestUpdate('')
    },

    settings,
    updateSettings: (newSettings: Settings) => {
      store.set(key.settings, newSettings)
      setSettings(newSettings)
    },
    restoreSettings: () => {
      store.set(key.settings, defaultSettings)
      setSettings(defaultSettings)
    },
    latestUpdate,
  }

  return <DBContext.Provider value={value}>{children}</DBContext.Provider>
}

export default function useDB() {
  return useContext(DBContext)
}
