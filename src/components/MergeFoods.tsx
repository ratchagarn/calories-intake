import { useState, useCallback } from 'react'
import { Input, Popup, Button, FloatingBubble, Toast } from 'antd-mobile'
import { CheckOutline, CloseOutline, ShrinkOutline } from 'antd-mobile-icons'
import { v4 as uuidv4 } from 'uuid'

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
  const [popupVisible, setPopupVisible] = useState(false)

  const handleOpenPopup = useCallback(async () => {
    setPopupVisible(true)
    const input = await getInput()
    setTimeout(() => {
      input.focus()
    }, 500)
  }, [])

  return (
    <>
      <Popup visible={popupVisible} bodyStyle={{ height: '90vh' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            padding: 16,
          }}
        >
          <label>Merge Food Name</label>
          <Input
            id={MERGE_FOODS_NAME}
            placeholder="Please fill merge food name..."
          />
          <Button
            style={{ marginTop: 16 }}
            color="primary"
            onClick={async () => {
              const input = await getInput()
              input.focus()

              if (input?.value) {
                onMerged(input.value)
                setPopupVisible(false)
                Toast.show({
                  content: 'Merge successed!',
                  duration: 500,
                })
              }
            }}
          >
            Merge
          </Button>
          <Button
            onClick={() => {
              setPopupVisible(false)
            }}
          >
            Cancel
          </Button>
        </div>
      </Popup>
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
              // backgroundColor: 'red',
            }}
          />
          <FloatingBubble style={getBubbleStyles()} onClick={handleOpenPopup}>
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

async function getInput(): Promise<HTMLInputElement> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(document.getElementById(MERGE_FOODS_NAME) as HTMLInputElement)
    })
  })
}

function getBubbleStyles(right = 16, invert = false) {
  const baseStyles = {
    '--initial-position-bottom': '32px',
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
        // ดึง multiplier ของอาหารจานปัจจุบันออกมา (กำหนดค่าเริ่มต้นเป็น 1 เผื่อกรณีไม่มีข้อมูล)
        const m = current.multiplier ?? 1

        return {
          // คูณ multiplier แล้วปัดเศษขึ้นด้วย Math.ceil ในแต่ละรอบ
          carb: acc.carb + Math.ceil(current.carb * m),
          pro: acc.pro + Math.ceil(current.pro * m),
          fat: acc.fat + Math.ceil(current.fat * m),
          kcal: acc.kcal + Math.ceil(current.kcal * m),
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
