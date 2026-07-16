import type { ReactNode } from 'react'

import { createContext, useContext, useState, useCallback } from 'react'
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
  eatedList: 'eatedList',
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
  store.get(key.eatedList) != null &&
  store.get(key.settings) != null &&
  store.get(key.latestUpdate) != null

export const createDB = () => {
  !store.get(key.targetCaloriesIntake) &&
    store.set(key.targetCaloriesIntake, defaultTargetCaloriesIntake)
  !store.get(key.foods) && store.set(key.foods, [])
  !store.get(key.eatedList) && store.set(key.eatedList, [])
  !store.get(key.settings) && store.set(key.settings, defaultSettings)
  !store.get(key.latestUpdate) && store.set(key.latestUpdate, '')
}

interface DBContextType {
  targetCaloriesIntake: number
  updateTargetCaloriesIntake: (kcal: number) => void
  foods: FoodDB[]
  addFood: (food: FoodDB) => void
  updateFood: (newValue: FoodDB) => void
  deleteFood: (id: string | string[], newFood?: FoodDB) => void
  eatedList: string[]
  toggleEatedList: (id: string) => void
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
  const [eatedList, setEatedList] = useState<string[]>(
    store.get(key.eatedList) || []
  )
  const [settings, setSettings] = useState<Settings>(
    store.get(key.settings) || {}
  )
  const [latestUpdate, setLatestUpdate] = useState<string>(
    store.get(key.latestUpdate) || ''
  )

  const getCurrentTime = () => dayjs().format()

  const setNewLatestUpdate = useCallback(() => {
    const currentTime = getCurrentTime()

    store.set(key.latestUpdate, currentTime)
    setLatestUpdate(currentTime)
  }, [])

  const updateTargetCaloriesIntake = (kcal: number) => {
    setTargetCaloriesIntake(kcal)
    store.set(key.targetCaloriesIntake, kcal)
  }

  const updateEatedList = useCallback((newEatedList: string[]) => {
    store.set(key.eatedList, newEatedList)
    setEatedList(newEatedList)
  }, [])

  const addFood = useCallback(
    (food: FoodDB) => {
      const newFoods = foods.concat([food])

      store.set(key.foods, newFoods)
      setFoods(newFoods)
      setNewLatestUpdate()
    },
    [foods, setNewLatestUpdate]
  )

  const updateFood = useCallback(
    (newFood: FoodDB) => {
      const updateFoods = foods.map((food) => {
        return food.id === newFood.id
          ? {
              ...newFood,
              updatedAt: getCurrentTime(),
            }
          : food
      })

      store.set(key.foods, updateFoods)
      setFoods(updateFoods)
      setNewLatestUpdate()
    },
    [foods, setNewLatestUpdate]
  )

  const deleteFood = useCallback(
    (id: string | string[], newFood?: FoodDB) => {
      const idsToDelete = new Set(Array.isArray(id) ? id : [id])

      const newFoods = foods.filter((food) => !idsToDelete.has(food.id))
      const newEatedList = eatedList.filter((i) => !idsToDelete.has(i))

      if (newFood) {
        newFoods.push(newFood)
      }

      store.set(key.foods, newFoods)
      setFoods(newFoods)

      updateEatedList(newEatedList)

      setNewLatestUpdate()
    },
    [foods, setNewLatestUpdate, eatedList, updateEatedList]
  )

  const toggleEatedList = useCallback(
    (id: string) => {
      let newEatedList = eatedList.slice(0)

      if (eatedList.includes(id)) {
        newEatedList = eatedList.filter((i) => i !== id)
      } else {
        newEatedList.push(id)
      }

      updateEatedList(newEatedList)
    },
    [eatedList, updateEatedList]
  )

  const getTotalCaloriesIntake = useCallback(() => {
    let result = 0

    foods.forEach((food) => {
      result += food.kcal * food.multiplier
    })

    return result
  }, [foods])

  const clearAllFoods = useCallback(() => {
    store.set(key.foods, [])
    setFoods([])

    store.set(key.eatedList, [])
    setEatedList([])
    setLatestUpdate('')
  }, [])

  const updateSettings = useCallback((newSettings: Settings) => {
    store.set(key.settings, newSettings)
    setSettings(newSettings)
  }, [])

  const restoreSettings = useCallback(() => {
    store.set(key.settings, defaultSettings)
    setSettings(defaultSettings)
  }, [])

  const value = {
    targetCaloriesIntake,
    updateTargetCaloriesIntake,
    foods,
    addFood,
    updateFood,
    deleteFood,
    eatedList,
    toggleEatedList,
    getTotalCaloriesIntake,
    clearAllFoods,
    settings,
    updateSettings,
    restoreSettings,
    latestUpdate,
  }

  return <DBContext.Provider value={value}>{children}</DBContext.Provider>
}

export default function useDB() {
  return useContext(DBContext)
}
