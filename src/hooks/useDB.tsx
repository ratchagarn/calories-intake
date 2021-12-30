import type { ReactNode } from 'react'

import { createContext, useContext, useEffect, useState } from 'react'
import store from 'store'

const key = {
  foods: 'foods',
}

const createDB = () => {
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
  multiple: number
}

interface DBContextType {
  foods: Food[]
  addFood: (food: Food) => void
  clearAllFoods: () => void
  getTotalCaloriesIntake: () => number
}

const DBContext = createContext<DBContextType>(null!)

export function DBProvider({ children }: { children: ReactNode }) {
  const [foods, setFoods] = useState<Food[]>(store.get(key.foods))

  useEffect(() => {
    createDB()
  }, [])

  const value = {
    foods,
    addFood: (food: Food) => {
      setFoods((prevFoods) => {
        const newFoods = prevFoods.concat([food])

        store.set(key.foods, newFoods)

        return newFoods
      })
    },
    getTotalCaloriesIntake: () => {
      let result = 0

      foods.forEach((food) => {
        result += food.kcal
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
