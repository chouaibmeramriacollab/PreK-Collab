import { BrowserWindow, ipcMain, nativeTheme } from 'electron';

import { isMacOS } from '../../utils';
import { appContext } from './context';
import { ensureSQLiteDB } from './data/ensure-db';
import { deleteWorkspace, listWorkspaces } from './data/workspace';
import {
  exportDBFile as saveDBFileAs,
  loadDBFile as loadDBFile,
  moveDBFile,
  revealDBFile,
} from './dialog';
import { getGoogleOauthCode } from './google-auth';
import { logger, revealLogFile } from './logger';

export const workspaceHandlers = {
  'workspace:list': async (): Promise<string[]> => listWorkspaces(appContext),
  'workspace:delete': async (id: string): Promise<void> =>
    deleteWorkspace(appContext, id),
};

export const uiHandlers = {
  'ui:theme-change': async (theme: (typeof nativeTheme)['themeSource']) => {
    nativeTheme.themeSource = theme;
  },
  'ui:sidebar-visibility-change': async (visible: boolean) => {
    if (isMacOS()) {
      const windows = BrowserWindow.getAllWindows();
      windows.forEach(w => {
        // hide window buttons when sidebar is not visible
        w.setWindowButtonVisibility(visible);
      });
    }
  },
  'ui:workspace-change': async (workspaceId: string) => {
    // ?
  },
  'ui:get-google-oauth-code': async () => {
    return getGoogleOauthCode();
  },
};

export const dbHandlers = {
  'db:get-doc': async (id: string) => {
    const workspaceDB = await ensureSQLiteDB(id);
    return workspaceDB.getEncodedDocUpdates();
  },
  'db:apply-doc-update': async (id: string, update: Uint8Array) => {
    const workspaceDB = await ensureSQLiteDB(id);
    return workspaceDB.applyUpdate(update);
  },
  'db:add-blob': async (workspaceId: string, key: string, data: Uint8Array) => {
    const workspaceDB = await ensureSQLiteDB(workspaceId);
    return workspaceDB.addBlob(key, data);
  },
  'db:get-blob': async (workspaceId: string, key: string) => {
    const workspaceDB = await ensureSQLiteDB(workspaceId);
    return workspaceDB.getBlob(key);
  },
  'db:get-persisted-blobs': async (workspaceId: string) => {
    const workspaceDB = await ensureSQLiteDB(workspaceId);
    return workspaceDB.getPersistentBlobKeys();
  },
  'db:delete-blob': async (workspaceId: string, key: string) => {
    const workspaceDB = await ensureSQLiteDB(workspaceId);
    return workspaceDB.deleteBlob(key);
  },
};

export const dialogHandlers = {
  'dialog:reveal-db-file': async (workspaceId: string) => {
    return revealDBFile(workspaceId);
  },
  'dialog:load-db-file': async () => {
    return loadDBFile();
  },
  'dialog:save-db-file-as': async (workspaceId: string) => {
    return saveDBFileAs(workspaceId);
  },
  'dialog:move-db-file': async (workspaceId: string) => {
    return moveDBFile(workspaceId);
  },
  'dialog:reveal-log-file': async () => {
    return revealLogFile();
  },
};

// Note: all of these handlers will be the single-source-of-truth for the apis exposed to the renderer process
export const allHandlers = {
  ...workspaceHandlers,
  ...uiHandlers,
  ...dbHandlers,
  ...dialogHandlers,
};

export const registerHandlers = () => {
  Object.entries(allHandlers).forEach(([type, fn]) => {
    ipcMain.handle(
      type,
      // todo: considering the event properties, like frame id, senders etc
      async (e, ...args) => {
        logger.info(
          '[ipc]',
          type,
          ...args.filter(arg => typeof arg !== 'object')
        );
        // @ts-ignore
        return await fn(...args);
      }
    );
  });
};
