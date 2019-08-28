/***
 *  Created by Nirav Bhimani
 ***/
import { IDBService } from 'database/idb';

const STORE_NAME = 'naviagtionPath';
const IDB_KEY = 'path';

export const storeCurrentPath = async () => {
  let indexedDBDataArray;
  let doesDBExist = await IDBService.checkIfDbStoreExists(STORE_NAME);

  const storeData = (data) => {
    let arr = data.find(item => {
      return item.title === IDB_KEY;
    });
    return indexedDBDataArray =  arr ? arr.data : [];
  };

  // If DB exist then update the store
  if (doesDBExist) {
    await IDBService.getAllFromStore(STORE_NAME, storeData);
    // If the last location in the array is similar to current then don't push the pathname
    // Else update the indexedDB with new data
    if (indexedDBDataArray[indexedDBDataArray.length - 1] === window.location.pathname) {
      return;
    }
    indexedDBDataArray.push(window.location.pathname);
    IDBService.updateItemInStore(STORE_NAME, 'path', indexedDBDataArray);
  }

  return;
};

