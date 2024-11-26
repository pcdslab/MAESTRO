// electron-api.d.ts
import { ElectronAPI } from '@electron-toolkit/preload'

declare module '@electron-toolkit/preload' {
  interface ElectronAPI {
    getEnvVariable: (key: string) => string | undefined
    runCmd: any
    onCmdOutput: any
    terminateCmd: any
    isWindows: any
    offCmdOutput: any
  }
}
