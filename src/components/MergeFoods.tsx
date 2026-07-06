import { useState, useCallback } from 'react'
import { Input, Dialog, FloatingBubble } from 'antd-mobile'
import { CheckOutline, CloseOutline, ShrinkOutline } from 'antd-mobile-icons'
import { v4 as uuidv4 } from 'uuid'

import { nutrientValue } from '@/helpers/utils'

import type { FoodDB } from 'hooks/useDB'

const MERGE_FOODS_NAME = 'MERGE_FOODS_NAME'

interface MergeFoodsProps {
  mode: MergeFoodBubbleProps['mode']
  onStartMergeClick?: VoidFunction
  onStopMergeClick?: VoidFunction
  onMerged: (name: string) => void
}

export const MergeFoods = ({
  mode,
  onStartMergeClick,
  onStopMergeClick,
  onMerged,
}: MergeFoodsProps) => {
  const handleMergeFood = useCallback(() => {
    Dialog.show({
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label>Merge Food Name</label>
          <Input
            id={MERGE_FOODS_NAME}
            placeholder="Please fill merge food name..."
          />
        </div>
      ),
      closeOnAction: true,
      actions: [
        [
          {
            key: 'cancel',
            text: 'Cancel',
          },
          {
            key: 'merge',
            text: 'Merge',
            bold: true,
            danger: true,
            onClick: () => {
              const mergeFoodsName = document.getElementById(
                MERGE_FOODS_NAME
              ) as HTMLInputElement | undefined

              if (mergeFoodsName?.value) {
                onMerged(mergeFoodsName.value)
              }
            },
          },
        ],
      ],
    })
  }, [onMerged])

  return (
    <>
      {mode === 'normal' ? (
        <FloatingBubble style={getBubbleStyles()} onClick={onStartMergeClick}>
          <ShrinkOutline fontSize={24} />
        </FloatingBubble>
      ) : null}
      {mode === 'select' ? (
        <>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: 180,
              opacity: 0.6,
            }}
          />
          <FloatingBubble style={getBubbleStyles()} onClick={handleMergeFood}>
            <CheckOutline fontSize={24} />
          </FloatingBubble>
          <FloatingBubble
            style={getBubbleStyles(72, true)}
            onClick={onStopMergeClick}
          >
            <CloseOutline fontSize={24} />
          </FloatingBubble>
        </>
      ) : null}
    </>
  )
}

MergeFoods.useMergeFoods = useMergeFoods

function getBubbleStyles(right = 16, invert = false) {
  const baseStyles = {
    '--initial-position-bottom': '16px',
    '--initial-position-right': `${right}px`,
    '--edge-distance': '16px',
  }

  return invert
    ? {
        ...baseStyles,
        '--adm-color-primary': 'white',
        '--adm-color-white': '#333',
      }
    : baseStyles
}

export function useMergeFoods() {
  const [mode, setMode] = useState<MergeFoodBubbleProps['mode']>('normal')
  const [selectedFoods, setSelectedFoods] = useState<FoodDB[]>([])

  const reset = useCallback(() => {
    setMode('normal')
    setSelectedFoods([])
  }, [])

  const switchMode = useCallback((nextMode: MergeFoodBubbleProps['mode']) => {
    setMode(nextMode)
  }, [])

  const toggleSelectedFoods = useCallback(
    (nextFood: FoodDB) => {
      const dupFood = selectedFoods.find((f) => f.id === nextFood.id)

      if (dupFood) {
        setSelectedFoods((state) => state.filter((s) => s.id !== nextFood.id))
      } else {
        setSelectedFoods((state) => state.concat(nextFood))
      }
    },
    [selectedFoods]
  )

  const createMergeFoods = (name: string): FoodDB => {
    const totalNutrients = selectedFoods.reduce(
      (acc, current) => {
        return {
          carb: Number(
            nutrientValue(acc.carb + current.carb, current.multiplier)
          ),
          pro: Number(nutrientValue(acc.pro + current.pro, current.multiplier)),
          fat: Number(nutrientValue(acc.fat + current.fat, current.multiplier)),
          kcal: Number(
            nutrientValue(acc.kcal + current.kcal, current.multiplier)
          ),
        }
      },
      { carb: 0, pro: 0, fat: 0, kcal: 0 }
    )

    return {
      id: uuidv4(),
      name,
      unit: 'srv',
      qty: 1,
      multiplier: 1,
      state: 'COOKED',
      ...totalNutrients,
    }
  }

  return {
    mode,
    switchMode,
    selectedFoods,
    toggleSelectedFoods,
    createMergeFoods,
    reset,
  }
}

interface MergeFoodBubbleProps {
  mode: 'normal' | 'select'
  onClick: VoidFunction
}
