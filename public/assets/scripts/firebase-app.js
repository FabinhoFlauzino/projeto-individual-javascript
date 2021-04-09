import firebaseConfig from '../../../firebase.json'
import firebase from 'firebase/app'
import 'firebase/auth'

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
} else {
    firebase.app()
}

export default firebase