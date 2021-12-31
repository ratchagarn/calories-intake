import type { ReactNode } from 'react'

import { createContext, useContext, useState } from 'react'
import store from 'store'

const key = {
  foods: 'foods',
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
  kcal: number
  carb: number
  pro: number
  fat: number
  multiplier: number
}

interface DBContextType {
  foods: Food[]
  addFood: (food: Food) => void
  updateFood: (newValue: Food) => void
  deleteFood: (id: string) => void
  clearAllFoods: () => void
  getTotalCaloriesIntake: () => number
}

const DBContext = createContext<DBContextType>(null!)

export function DBProvider({ children }: { children: ReactNode }) {
  const [foods, setFoods] = useState<Food[]>(store.get(key.foods) || [])

  const value = {
    foods,
    addFood: (food: Food) => {
      const newFoods = foods.concat([food])

      store.set(key.foods, newFoods)
      setFoods(newFoods)
    },
    updateFood: (newValue: Food) => {
      const updateFoods = foods.map((food) => {
        return food.id === newValue.id ? newValue : food
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
  }

  return <DBContext.Provider value={value}>{children}</DBContext.Provider>
}

export default function useDB() {
  return useContext(DBContext)
}
