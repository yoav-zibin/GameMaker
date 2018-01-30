import * as firebase from 'firebase';
import config from './config.json';
import constants from './constants';

export const firebaseApp = firebase.initializeApp(config);
export const db = firebaseApp.database();
export const auth = firebaseApp.auth();
export const storage = firebaseApp.storage();

export const gameBuilderRef = db.ref(constants.GAMEBUILDER_PATH);
export const imagesDbRef = gameBuilderRef.child(constants.IMAGES_PATH);
export const elementsRef = gameBuilderRef.child(constants.ELEMENTS_PATH);
export const imagesRef = storage.ref().child(constants.IMAGES_PATH);
export const specsRef = gameBuilderRef.child(constants.SPECS_PATH);

export const storageKey = constants.AUTHENTICATION_LOCAL_STORAGE_KEY;

export const googleProvider = new firebase.auth.GoogleAuthProvider();

export const isAuthenticated = () => {
  return !!auth.currentUser || !!localStorage.getItem(storageKey);
};
