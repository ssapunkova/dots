import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class StorageService{

  constructor(
      public storage: Storage
  ) { }

  async set(title, value){
    this.storage.set(title, value);
  }

  async get(title){
    return this.storage.get(title);
  }

}
