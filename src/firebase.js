import firebase from 'firebase';
import config from '../config.json';

let fire = firebase.initializeApp(config);

export default fire;
