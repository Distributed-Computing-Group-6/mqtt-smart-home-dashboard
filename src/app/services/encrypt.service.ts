import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptService {
  private secretKey = environment.encryptionKey;

  private encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }

  private decryptData(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption failed:', error);
      return '';
    }
  }

  public saveCredentials(username: string, password: string): void {
    sessionStorage.setItem('mqttUsername', this.encryptData(username));
    sessionStorage.setItem('mqttPassword', this.encryptData(password));
  }

  public getCredentials(): { username: string; password: string } | null {
    const encryptedUsername = sessionStorage.getItem('mqttUsername');
    const encryptedPassword = sessionStorage.getItem('mqttPassword');

    if (encryptedUsername && encryptedPassword) {
      return {
        username: this.decryptData(encryptedUsername),
        password: this.decryptData(encryptedPassword),
      };
    }
    return null;
  }

  public clearCredentials(): void {
    sessionStorage.removeItem('mqttUsername');
    sessionStorage.removeItem('mqttPassword');
    
    localStorage.removeItem('mqttUsername');
    localStorage.removeItem('mqttPassword');
  }
}
  
