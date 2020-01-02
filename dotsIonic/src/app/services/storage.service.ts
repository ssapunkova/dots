import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

// Storage Service
// Implements communication between the app and local/native storage using IonicStorage

@Injectable()
export class StorageService{

  constructor(
      public storage: Storage
  ) { }

  // Setter for IonicStorage
  async set(title, value){
    this.storage.set(title, value);
  }

  // Getter for IonicStorage
  async get(title){
    return this.storage.get(title);
  }

}
