import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  sendNotification,
} from '@tauri-apps/plugin-notification';
import { warn } from "@tauri-apps/plugin-log"
import usePermissionStore from "@/stores/permissions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function notify(title: string, body: string) {
  const { messagePermission } = usePermissionStore.getState() 
  warn(`=====================> Notification Permission: ${messagePermission}`)
  if (!messagePermission) return

  sendNotification({
              title: title,
              body: body,
              largeBody: body, 
            });
}


