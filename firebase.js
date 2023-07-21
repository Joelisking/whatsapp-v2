import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'


const firebaseConfig = {
	apiKey: 'AIzaSyCUs4jHaqYnsBbX43mxy1nQjdyrYn1CuX8',
	authDomain: 'hi-bye-f9fb6.firebaseapp.com',
	projectId: 'hi-bye-f9fb6',
	storageBucket: 'hi-bye-f9fb6.appspot.com',
	messagingSenderId: '296049919259',
	appId: '1:296049919259:web:7d8ee6b6ae41493d943fbe',
}

const app = !firebase.apps.length
	? firebase.initializeApp(firebaseConfig)
	: firebase.app()

const db = app.firestore()
const auth = app.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export { db, auth, provider }