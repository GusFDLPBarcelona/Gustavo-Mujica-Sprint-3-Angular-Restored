import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Firebase se inicializa automáticamente con las credenciales del entorno
initializeApp();

const db = getFirestore();

export default db;
