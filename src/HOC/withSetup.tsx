import type { ComponentType } from 'react'

import { useEffect, useState } from 'react'
import { Loading } from 'antd-mobile'
import styled from '@emotion/styled'

import { dbIsExists, createDB } from '@/hooks/useDB'

import foodPresetData from '@/constant/foodPresetData'

export default function withSetup<T>(Component: ComponentType<T>) {
  return (hocProps: T) => {
    const [isReady, setIsReady] = useState<boolean>(false)

    useEffect(() => {
      if (dbIsExists() && foodPresetData.length > 0) {
        setIsReady(true)
      } else {
        createDB()

        setTimeout(() => {
          setIsReady(true)
        }, 1000)
      }
    }, [])

    if (!isReady) {
      return (
        <FullPageLoading>
          <Loading />
        </FullPageLoading>
      )
    }

    return <Component {...hocProps} />
  }
}

const FullPageLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 3em;
`
