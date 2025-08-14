import { useEffect, useRef, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification';

function Home() {
  const [online, setOnline] = useState(false);
  const prevOnline = useRef<boolean | null>(null); // null so we don't alert on first read
  const notifyOk = useRef(false);

  // Ask for permission once
  useEffect(() => {
    (async () => {
      let granted = await isPermissionGranted();
      if (!granted) granted = (await requestPermission()) === 'granted';
      notifyOk.current = granted;
    })();
  }, []);

  useEffect(() => {
    async function checkOnline() {
      try {
        const val = await invoke<boolean>('check_online');
        setOnline(val);

        // Notify only on transition online -> offline
        if (prevOnline.current === true && val === false && notifyOk.current) {
          sendNotification({
            title: 'Dev Monitor',
            body: 'You are offline!',
            largeBody: 'You are offline!', 
          });
        }

        prevOnline.current = val;
      } catch {
        setOnline(false);
        if (prevOnline.current === true && notifyOk.current) {
          sendNotification({ title: 'Dev Monitor', body: 'You are offline!' });
        }
        prevOnline.current = false;
      }
    }
    checkOnline(); // immediate
    const interval = setInterval(checkOnline, 10_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center overflow-y-auto pt-safe-top pb-safe-bottom">
      <h1 className="text-2xl font-semibold">Home Page</h1>
      <div>
        {online ? <span>Online: </span> : <span>Offline: </span>}
        <span
          aria-label={online ? 'online' : 'offline'}
          className={`inline-block h-3 w-3 rounded-full ${online ? 'bg-green-500' : 'bg-red-500'}`}
        />
      </div>
    </div>
  );
}

export default Home;
