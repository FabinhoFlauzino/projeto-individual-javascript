import firebase from './firebase-app'
import IMask from 'imask'
import { hideAlert, showAlert } from './utils'

document.querySelectorAll('.email').forEach(page => {

    const db = firebase.firestore()
    const auth = firebase.auth()

    
    const btnSubmit = page.querySelector('[type=submit]')
    const date = new Date()
    const nameElement = page.querySelector('#name')
    const phoneElement = page.querySelector('#phone')
    const emailElement = page.querySelector('#email')
    const messageElement = page.querySelector('#message')
    const day = date.getDate().toString()
    const month = date.getMonth().toString()
    const year = date.getFullYear().toString()
    const hour = date.getHours().toString()
    const minute = date.getMinutes().toString()
    const second = date.getSeconds().toString()
    let emailId = year + month + day + hour + minute + second

    if (phoneElement) {
        new IMask(phoneElement, {
            mask: '(00) 0000-0000[0]'
        })
    }

    if (btnSubmit) {



        hideAlert("error");

        btnSubmit.addEventListener('click', e => {

            e.preventDefault()


            auth.onAuthStateChanged(user => {

                if (user) {

                    const email = db.collection(`email/${User.id}/contact`).doc(emailId)

                    email.set({
                        date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}/
                                ${date.getHours()}:${date.getMinutes()}`,
                        "name": nameElement.value,
                        "phone": phoneElement.value,
                        "email": emailElement.value,
                        "message": messageElement.value,
                    }).then(() => {
                        showAlert("Email enviado com sucesso.", "success")
                        setTimeout(() => {
                            window.location.href = '/'
                        }, 3000);
                    }).catch(err => {
                        console.log(err);
                    })

                } else {
                    showAlert("Você deverá estar logado para enviar mensagem", "error")
                    setTimeout(() => {
                        window.location.href = 'auth.html'
                    }, 3000);

                }
            })

        })
    }
})