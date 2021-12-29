import type { ReactNode } from 'react'

import { createContext, useContext, useEffect, useState } from 'react'
import store from 'store'
import { v4 as uuidv4 } from 'uuid'

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
  addFood: (food?: Food) => void
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
    addFood: (food?: Food) => {
      setFoods((prevFoods) => {
        const newFoods = prevFoods.concat([
          {
            id: uuidv4(),
            name: 'ข้าว 100g',
            kcal: 130,
            carb: 28,
            pro: 2,
            fat: 0,
            multiple: parseFloat(
              (Math.random() * 2 + 0.1).toString().slice(0, 3)
            ),
          },
        ])

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
