import { type FirebaseOptions, initializeApp } from 'firebase/app';
import { name } from '@/../package.json';
import { bloggerData } from './blogger-data';

export const firebaseConfig: FirebaseOptions =
	bloggerData.initial.firebase.config || {};

export const app = initializeApp(firebaseConfig, name);
