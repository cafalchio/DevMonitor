import { useEffect } from 'react';
import useConnectionStore from '@/stores/connection';
import ItemPC from '@/components/pc_item';


function Home() {
  const { isOnline, checkOnline } = useConnectionStore()


  useEffect(() => {
    checkOnline() // run once on mount
  }, [checkOnline])

  return (
    <div className="flex flex-col items-center justify-center overflow-y-auto pt-safe-top pb-safe-bottom">
      <h1 className="text-2xl font-semibold">Home Page</h1>
      <div>
        {isOnline ? <span>Online: </span> : <span>Offline: </span>}
        <span
          aria-label={isOnline ? 'online' : 'offline'}
          className={`inline-block h-3 w-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
        />
      </div>
      <ItemPC />
    </div>
  );
}

export default Home;
