import IMask from 'imask'
import firebase from './firebase-app'

document.querySelectorAll('#profile').forEach(page => {

    const auth = firebase.auth()
    let userId

    auth.onAuthStateChanged(user => {

        if (user) {
            userId = user.uid

            const db = firebase.firestore()

            const formElement = page.querySelector('form')
            const nameElement = page.querySelector('#name')
            const emailElement = page.querySelector('#email')
            const birthElement = page.querySelector('#birth_at')
            const documentElement = page.querySelector('#document')
            const phoneElement = page.querySelector('#phone')
            const btnSuccess = page.querySelector('.toast.success')

            if (documentElement) {
                new IMask(documentElement, {
                    mask: '000.000.000-00'
                })
            }

            if (phoneElement) {
                new IMask(phoneElement, {
                    mask: '(00) 0000-0000[0]'
                })
            }

            if (formElement) {
                formElement.addEventListener('submit', e => {

                    e.preventDefault()

                    const perfil = db.collection(`perfil`).doc(userId)

                    perfil.set({

                        "name": nameElement.value,
                        "email": emailElement.value,
                        "birth_at": birthElement.value,
                        "document": documentElement.value,
                        "phone": phoneElement.value,

                    }).then(() => {
                        btnSuccess.classList.add('open')
                        setTimeout(() => {
                            window.location.href = '/'
                        }, 1000);
                    }).catch(err => window.location.href = '404.html')
                })
            }

            db.collection('perfil')
                .doc(userId)
                .get()
                .then(doc => {

                    if (nameElement) {
                        nameElement.value = doc.data().name
                    }

                    if (emailElement) {
                        emailElement.value = doc.data().email
                    }

                    if (birthElement) {
                        birthElement.value = doc.data().birth_at
                    }

                    if (documentElement) {
                        documentElement.value = doc.data().document
                    }

                    if (phoneElement) {
                        phoneElement.value = doc.data().phone
                    }
                }).catch(err => window.location.href = '404.html')
        } else {
            window.location.href = 'login.html'
        }
    })

})