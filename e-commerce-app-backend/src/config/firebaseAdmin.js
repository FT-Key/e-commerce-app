import admin from "firebase-admin";

let firebaseAdmin = null;

try {
  // Verificar si existe la variable de entorno
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT_KEY no está configurada');
    console.warn('💡 El servidor funcionará pero Firebase Admin no estará disponible');
  } else {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    
    firebaseAdmin = admin;
    console.log('✅ Firebase Admin inicializado correctamente');
  }
} catch (error) {
  console.error('❌ Error al inicializar Firebase Admin:', error.message);
  console.warn('💡 El servidor continuará pero las funciones de Firebase no estarán disponibles');
}

export default firebaseAdmin;