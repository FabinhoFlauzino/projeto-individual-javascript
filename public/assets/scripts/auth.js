import firebase from './firebase-app'
import { getFormValues, getQueryString, hideAlertError, showAlertError } from './utils'

const authPage = document.querySelector('main#auth')

if (authPage) {

    const auth = firebase.auth()

    const hideAuthForms = () => {

        document.querySelectorAll('#auth form').forEach(el => el.classList.add('hide'))
    }

    const showAuthForm = id => {

        document.getElementById(id).classList.remove('hide')
    }

    const authHash = () => {
        hideAuthForms()

        if (sessionStorage.getItem('email')) {
            document.querySelectorAll('[name=email]')
                    .forEach(el => el.value = sessionStorage.getItem('email'))
        }

        switch (window.location.hash) {
            case '#register':
                showAuthForm('register')
                break
            case '#login':
                showAuthForm('login')
            break
            case '#forget':
                showAuthForm('forget')
            break
            case '#reset':
                showAuthForm('reset')
            break
            default:
                showAuthForm('login')
                break
        }
    }

    window.addEventListener('load', e => {
        authHash()
    })

    window.addEventListener('hashchange', e => {
        authHash()
    })

    const formAuthEmail = document.querySelector('#auth-email')

    formAuthEmail.addEventListener('submit', e => {
        e.preventDefault()

        const btnSubmit = e.target.querySelector('[type=submit]')

        btnSubmit.disabled = true

        sessionStorage.setItem('email', formAuthEmail.email.value)
        location.hash = '#login'

        btnSubmit.disabled = false
        
    })

    const formAuthRegister = document.querySelector('#register')
   
    formAuthRegister.addEventListener("submit", (e) => {
        e.preventDefault()

        hideAlertError(formAuthRegister)

        const values = getFormValues(formAuthRegister)

        auth.createUserWithEmailAndPassword(values.email, values.password)
            .then((response) => {
                const { user } = response

                user.updateProfile({
                    displayName: values.name,
                })

                window.location.href = "/"
            })
            .catch(showAlertError(formAuthRegister))
    })

    const formAuthLogin = document.querySelector('#login')

    formAuthLogin.addEventListener('submit', e => {
        e.preventDefault()

        hideAlertError(formAuthLogin)

        const values = getFormValues(formAuthLogin)

        auth.signInWithEmailAndPassword(values.email, values.password)
            .then(response => {
                window.location.href = "/";
            })
            .catch(showAlertError(formAuthLogin));
    })
}