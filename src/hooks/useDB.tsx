import type { ReactNode } from 'react'

import { createContext, useContext, useState } from 'react'
import store from 'store'

const key = {
  foods: 'foods',
  settings: 'settings',
}

export const dbIsExists = () => store.get(key.foods) != null

export const createDB = () => {
  if (store.get(key.foods)) {
    return
  }

  store.set(key.foods, [])
}

export interface Food {
  id: string
  name: string
  qty: number
  unit: string
  kcal: number
  carb: number
  pro: number
  fat: number
  multiplier: number
  updatedAt?: number
}

export interface Settings {
  numberKeyboardPreview: boolean
}

interface DBContextType {
  foods: Food[]
  addFood: (food: Food) => void
  updateFood: (newValue: Food) => void
  deleteFood: (id: string) => void
  clearAllFoods: VoidFunction
  getTotalCaloriesIntake: () => number
  settings: Settings
  updateSettings: (newSettings: Settings) => void
}

const DBContext = createContext<DBContextType>(null!)

export function DBProvider({ children }: { children: ReactNode }) {
  const [foods, setFoods] = useState<Food[]>(store.get(key.foods) || [])
  const [settings, setSettings] = useState<Settings>(
    store.get(key.settings) || {}
  )

  const value = {
    foods,
    addFood: (food: Food) => {
      const newFoods = foods.concat([food])

      store.set(key.foods, newFoods)
      setFoods(newFoods)
    },
    updateFood: (newValue: Food) => {
      const updateFoods = foods.map((food) => {
        return food.id === newValue.id
          ? {
              ...newValue,
              updatedAt: new Date().getTime(),
            }
          : food
      })

      store.set(key.foods, updateFoods)
      setFoods(updateFoods)
    },
    deleteFood: (id: string) => {
      const updateFoods = foods.filter((food) => {
        return food.id !== id
      })

      store.set(key.foods, updateFoods)
      setFoods(updateFoods)
    },
    getTotalCaloriesIntake: () => {
      let result = 0

      foods.forEach((food) => {
        result += food.kcal * food.multiplier
      })

      return result
    },
    clearAllFoods: () => {
      setFoods([])
      store.set(key.foods, [])
    },

    settings,
    updateSettings: (newSettings: Settings) => {
      const mergedSettings = {
        ...settings,
        ...newSettings,
      }

      store.set(key.foods, mergedSettings)
      setSettings(mergedSettings)
    },
  }

  return <DBContext.Provider value={value}>{children}</DBContext.Provider>
}

export default function useDB() {
  return useContext(DBContext)
}
