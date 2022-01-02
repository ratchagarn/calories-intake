import type { ReactNode } from 'react'

import { createContext, useContext, useState } from 'react'
import store from 'store'
import dayjs from 'dayjs'

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
  updatedAt?: string
}

export interface Settings {
  numberKeyboardPreview: boolean
  displayLatestUpdate: boolean
}

const key = {
  foods: 'foods',
  settings: 'settings',
  latestUpdate: 'latestUpdate',
}

export const defaultSettings: Settings = {
  numberKeyboardPreview: true,
  displayLatestUpdate: true,
}

export const dbIsExists = () =>
  store.get(key.foods) != null &&
  store.get(key.settings) != null &&
  store.get(key.latestUpdate) != null

export const createDB = () => {
  !store.get(key.foods) && store.set(key.foods, [])
  !store.get(key.settings) && store.set(key.settings, defaultSettings)
  !store.get(key.latestUpdate) && store.set(key.latestUpdate, '')
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
  restoreSettings: VoidFunction
  latestUpdate: string
}

const DBContext = createContext<DBContextType>(null!)

export function DBProvider({ children }: { children: ReactNode }) {
  const [foods, setFoods] = useState<Food[]>(store.get(key.foods) || [])
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

  const value = {
    foods,
    addFood: (food: Food) => {
      const newFoods = foods.concat([food])

      store.set(key.foods, newFoods)
      setFoods(newFoods)
      setNewLatestUpdate()
    },
    updateFood: (newValue: Food) => {
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
