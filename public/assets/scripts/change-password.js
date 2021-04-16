import { getFormValues, hideAlertError, showAlertError } from "./utils"
import firebase from './firebase-app'

document.querySelectorAll('#change-password').forEach(page => {

    let userGlobal = null
    const form = page.querySelector('form')
    const btnSubmit = form.querySelector('[type=submit]')
    const alertSucess = form.querySelector('.toast.success')
    const auth = firebase.auth()

    auth.onAuthStateChanged(user => {

        if (user) {
            userGlobal = user
        }
    })

    form.addEventListener('submit', e => {
        e.preventDefault()

        hideAlertError(form)

        const { password_new, password_confirm, password_current} = getFormValues(form)

        if (password_new !== password_confirm) {
            
            return showAlertError(form)({
                message: 'Confirme a Senha Corretamente'
            })
        }

        if (!userGlobal) {
            return showAlertError(form)({
                message: 'Usuário Indefinido'
            })
        }

        btnSubmit.disabled = true
        btnSubmit.innerHTML = 'Salvando'
        alertSucess.classList.remove('open')

        auth.signInWithEmailAndPassword(userGlobal.email, password_current)
            .then(() => userGlobal.updatePassword(password_new))
            .then(() => {
                alertSucess.classList.add('open')
                setTimeout(()=>{
                    window.location.href = '/'
                }, 1500);
            })
            .catch(showAlertError(form))
            .finally(() => {
                btnSubmit.disabled = false
                btnSubmit.innerHTML = 'Salvar'
            })
    })

})