import firebase from 'firebase';
import config from './config.json';
import constants from './constants';

export const firebaseApp = firebase.initializeApp(config);
export const db = firebaseApp.database();
export const auth = firebaseApp.auth();

export const storageKey = constants.AUTHENTICATION_LOCAL_STORAGE_KEY;

export const isAuthenticated = () => {
  return !!auth.currentUser || !!localStorage.getItem(storageKey);
}
