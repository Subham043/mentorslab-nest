import { BadRequestException, Injectable } from '@nestjs/common';
import { createCipheriv, randomBytes, createDecipheriv } from 'crypto';

@Injectable()
export class EncryptionHook {
  private readonly algorithm = 'aes-256-cbc';

  // generate 16 bytes of random data
  private readonly initVector = randomBytes(16);

  // secret key generate 32 bytes of random data
  private readonly securitykey =
    process.env.encryptionKey || 'abcdefghijklmnopqrstuvwxyz123456';
  constructor() {}

  async encrypt(value: string): Promise<string> {
    // the cipher function
    const cipher = createCipheriv(
      this.algorithm,
      this.securitykey,
      this.initVector,
    );
    let encryptedData = cipher.update(value, 'utf-8', 'hex');

    encryptedData += cipher.final('hex');

    console.log('Encrypted message: ' + encryptedData);
    return encryptedData;
  }

  async decrypt(value: string): Promise<string> {
    const decipher = createDecipheriv(
      this.algorithm,
      this.securitykey,
      this.initVector,
    );

    try {
      let decryptedData = decipher.update(value, 'hex', 'utf-8');

      decryptedData += decipher.final('utf8');

      return decryptedData;
    } catch (error) {
      throw new BadRequestException('Invalid Encrypted Value');
    }
  }
}
