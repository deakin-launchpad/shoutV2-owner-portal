/***
 *  Created by Nirav Bhimani
 ***/

// When indexedDB is working properly then paths stored in store will be used for naviagtion
//    If path doesnt exist in store then use last stored path in store otherwise redirect to home
//
// If indexed DB fails to some issue comes up then application-flow.json will decide the application flow
// LIMITATION:
//   1. When indexedDB is not working then case where current: '/xyz' to -> previous: '/abc/1' will not work since next route path number is stored anywhere.
//      Only solution is to hardcode for all possible numbers/combination

import PropTypes from 'prop-types';
import { ApplicationFlow } from 'configurations/index';
import { IDBService } from 'database/idb';

const STORE_NAME = 'naviagtionPath';
const STORAGE_KEY = 'path';

// Function expects the props.history data
export const customBackButtonHandler = async (history) => {

  let indexedDBDataArray;

  let doesStoreExists = await IDBService.checkIfDbStoreExists(STORE_NAME);
  const storeData = (data) => {
    let arr = data.find(item => {
      return item.title === STORAGE_KEY;
    });
    return indexedDBDataArray = arr ? arr.data : [];
  };

  if (doesStoreExists) {
    await IDBService.getAllFromStore(STORE_NAME, storeData);
  } else {
    indexedDBDataArray = [];
  }

  // Check whether URL contains number
  // If number exist then replace number with :id & find
  // Else normally find
  function processURL(item) {
    if (window.location.pathname.match(/\/\d+(?=\/|\b)/g) !== null) {
      let split = window.location.pathname.split('/');
      split.map((item, key) => {
        if (RegExp(/^\d+$/).test(item)) {
          split[key] = ':id';
        }
        return item;
      });
      return item === split.join('/');
    }
    return item === window.location.pathname;
  }

  // For special & generic
  function checkAppFlowCases(arr) {
    let data;
    arr.map((item) => {
      return typeof item.current === 'string' ? (
        processURL(item.current) ? (data = item) : null
      ) : (
        item.current.map(str => {
          return processURL(str) ? (data = item) : null;
        })
      );
    });
    return data;
  }

  let specialObj = await ApplicationFlow.specialCases.length > 0 ? checkAppFlowCases(ApplicationFlow.specialCases) : null;
  let obj = await specialObj ? specialObj : checkAppFlowCases(ApplicationFlow.generic);

  // When indexedDB is not avilable then replace the :id with number from previous number
  const updateURL = () => {
    let originalURL = window.location.pathname.match(/\/\d+(?=\/|\b)/g);
    // Remove \ from string of array
    // \ is only at start of string thus check regex expression checks only at start
    let previousURL = obj.previous.match(/\/:id/g);
    // Check if URL contains :id
    if (previousURL !== null) {
      originalURL.map((item, key) => {
        return originalURL[key] = item.replace(/^\//g, '');
      });
      let paramsArray = originalURL.splice(0, previousURL.length);
      let splitItems = obj.previous.split('/');

      splitItems.map((item, key) => {
        if (RegExp(/^:id$/g).test(item)) {
          splitItems[key] = paramsArray[0];
          paramsArray.shift();
        }
        return item;
      });

      history.replace(splitItems.join('/'));
    } else {
      history.replace(obj.previous);
    }
  };

  if (indexedDBDataArray.length > 0 && doesStoreExists) {
    // When only one obj is in store
    if (indexedDBDataArray.length === 1) {
      indexedDBDataArray.pop();
      IDBService.updateItemInStore(STORE_NAME, STORAGE_KEY, indexedDBDataArray);
      return history.replace(ApplicationFlow.defaultHome);         // Then redirect to default home
    } else if (indexedDBDataArray[indexedDBDataArray.length - 1] === window.location.pathname) {
      indexedDBDataArray.pop();
      IDBService.updateItemInStore(STORE_NAME, STORAGE_KEY, indexedDBDataArray);
      return history.goBack();
    } else {        // If the path doesnt match then
      // When user goes to invalid URL then return user to last URL stored in indexedDB
      let lastURL = indexedDBDataArray[indexedDBDataArray.length - 1];
      indexedDBDataArray.pop();
      IDBService.updateItemInStore(STORE_NAME, STORAGE_KEY, indexedDBDataArray);
      return history.replace(lastURL);
    }
  } else if (indexedDBDataArray.length === 0 && doesStoreExists) {
    return history.replace(ApplicationFlow.defaultHome);
  }

  // Return when indexedDBArray less than 0
  return obj !== undefined ? (
    doesStoreExists ? history.replace(obj.previous) : updateURL()     // When db doesnt exist then replace the :id with number from previous number
  ) : history.replace(ApplicationFlow.errorPage);      // If no match found in JSON file then redirect to errorPage path
};

customBackButtonHandler.propTypes = {
  history: PropTypes.func.isRequired,
};
