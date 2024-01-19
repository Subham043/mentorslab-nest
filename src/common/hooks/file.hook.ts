import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import { MemoryStoredFile } from 'nestjs-form-data';

@Injectable()
export class FileHook {
  async removeFile(filePath: string): Promise<boolean> {
    try {
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }

  async saveFile(
    file: MemoryStoredFile,
    path: string,
  ): Promise<string | undefined> {
    try {
      const generateFileName = this.fileName(file.originalName);
      await fs.appendFile('./uploads/' + path + generateFileName, file.buffer);
      return generateFileName;
    } catch (error) {
      console.log('savefile error: ', error);
      return undefined;
    }
  }

  fileName(originalName: string): string {
    const name = originalName.split('.')[0];
    const fileExtName = originalName.split('.')[1];
    const randomName = Array(3)
      .fill(null)
      .map(() => Math.round(Math.random() * Date.now()).toString(16))
      .join('');
    const snakeCaseName = (name + randomName)
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map((word) => word.toLowerCase())
      .join('_');
    return `${snakeCaseName}.${fileExtName}`;
  }
}
