import { Injectable } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

@Injectable({ providedIn: 'root' })
export class LogService {
  private readonly LOG_FILE = 'app-PanicNow.log';
  private isWriting = false;

  public async log(message: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] ${message}\n`;

    try {
      if ((Filesystem as any).appendFile) {
        await (Filesystem as any).appendFile({
          path: this.LOG_FILE,
          data: entry,
          directory: Directory.Data,
          encoding: Encoding.UTF8,
        });
      } else {
        const existing = await this.readRaw();
        await Filesystem.writeFile({
          path: this.LOG_FILE,
          data: existing + entry,
          directory: Directory.Data,
          encoding: Encoding.UTF8,
        });
      }
    } catch (e) {
      console.error('LogService: error escribiendo log', e);
    }
  }

  public async getAll(): Promise<string> {
    return this.readRaw();
  }

  public async clear(): Promise<void> {
    try {
      await Filesystem.deleteFile({
        path: this.LOG_FILE,
        directory: Directory.Data,
      });
    } catch {
    }
  }

  private async readRaw(): Promise<string> {
    try {
      const file = await Filesystem.readFile({
        path: this.LOG_FILE,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
      if (typeof file.data === 'string') {
        return file.data;
      } else if (file.data instanceof Blob) {
        return await file.data.text();
      } else {
        return '';
      }
    } catch {
      return '';
    }
  }
}
