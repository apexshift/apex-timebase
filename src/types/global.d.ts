/// <reference types="vite/client" />

import type DependencyManager from '@/utils/DependencyManager';

interface ApexGlobal {
  deps?: Record<string, any>;
  DependencyManager?: DependencyManager;
}

declare global {
  interface Window {
    Apex?: ApexGlobal;
  }
}

export {};
