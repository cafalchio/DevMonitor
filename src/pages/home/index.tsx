import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/core' // v2. For v1: '@tauri-apps/api/tauri'

function Home() {
  const [online, setOnline] = useState(false)

  useEffect(() => {
    let cancelled = false

    invoke<boolean>('check_online')
      .then((val) => {
        if (!cancelled) setOnline(val)
      })
      .catch((_err) => {
        if (!cancelled) setOnline(false)
      })

    return () => {
      cancelled = true
    }
  }, []) // run once

  return (
    <div className="flex flex-col items-center justify-center overflow-y-auto pt-safe-top pb-safe-bottom">
      <h1 className="text-2xl font-semibold">Home Page</h1>
      <div>Online: {String(online)}</div>
    </div>
  )
}

export default Home
