import firebase from 'firebase';
import config from './config.json';
import constants from './constants';

export const firebaseApp = firebase.initializeApp(config);
export const db = firebaseApp.database();
export const auth = firebaseApp.auth();
export const storage = firebaseApp.storage();

export const gameBuilderDbRef = db.ref(constants.GAME_BUILDER_PATH);
export const imagesDbRef = gameBuilderDbRef.child(constants.IMAGES_PATH);
export const imagesRef = storage.ref().child(constants.IMAGES_PATH);
export const specsRef = db.ref(constants.SPECS_PATH);

export const storageKey = constants.AUTHENTICATION_LOCAL_STORAGE_KEY;

export const googleProvider = new firebase.auth.GoogleAuthProvider();

export const isAuthenticated = () => {
  return !!auth.currentUser || !!localStorage.getItem(storageKey);
};
