"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
// Firebase se inicializa automáticamente con las credenciales del entorno
(0, app_1.initializeApp)();
const db = (0, firestore_1.getFirestore)();
exports.default = db;
//# sourceMappingURL=firebase.js.map