export interface ServerContext {
  registerCommand: (command: string, fn: (...args: any[]) => any) => void;
  unregisterCommand: (command: string) => void;
}

/**
 * @internal
 */
export const __INTERNAL__ = {};
