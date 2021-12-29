import type { FC } from 'react'

import RootApp from '@/components/RootApp'

import { DBProvider } from '@/hooks/useDB'

import './App.css'

const App: FC = () => {
  return (
    <DBProvider>
      <RootApp />
    </DBProvider>
  )
}

export default App
