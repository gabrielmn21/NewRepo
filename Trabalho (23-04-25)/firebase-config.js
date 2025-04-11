// Configuração do Firebase (substitua com seus dados)
const firebaseConfig = {
    apiKey: "AIzaSyDTL_GOP5Ru8m-BFvuGugPWTlihBCtx3CI",
    authDomain: "simpleshop-673e1.firebaseapp.com",
    projectId: "simpleshop-673e1",
    storageBucket: "simpleshop-673e1.firebasestorage.app",
    messagingSenderId: "256237761841",
    appId: "1:256237761841:web:bf563edcc4a751c7a32c10"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Inicializa os serviços
const auth = firebase.auth();
const db = firebase.firestore();
// Adicione esta verificação
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Verifique se os serviços estão sendo inicializados
console.log("Firebase Auth:", firebase.auth() ? "OK" : "Falha");
console.log("Firebase Firestore:", firebase.firestore() ? "OK" : "Falha");

