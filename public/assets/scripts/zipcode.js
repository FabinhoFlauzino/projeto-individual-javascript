import axios from 'axios'
import IMask from 'imask'
import { setFormValues } from './utils'
import firebase from './firebase-app'

document.querySelectorAll(".zipcode").forEach(zipode => {

    const auth = firebase.auth()
    let userId

    auth.onAuthStateChanged(user => {

        if (user) {
            userId = user.uid

            const db = firebase.firestore()

            const page = zipode.closest(".page")
            const zipcodeElement = page.querySelector('#zipcode')
            const formElement = page.querySelector("form")
            const btnZipcodeElement = page.querySelector('#btn-search')
            const numberElement = page.querySelector("#number")
            const addressElement = page.querySelector("#address")
            const complementElement = page.querySelector("#complement")
            const districtElement = page.querySelector("#district")
            const cityElement = page.querySelector("#city")
            const stateElement = page.querySelector("#state")
            const btnSuccess = page.querySelector('.toast.success')

            new IMask(zipcodeElement, {
                mask: '00000-000'
            })

            const searchZopcode = () => {
        
                const {value} = zipcodeElement
            
                btnZipcodeElement.disabled = true
                btnZipcodeElement.innerHTML = 'Buscando...'
        
                axios({
                    url: `https://viacep.com.br/ws/${value.replace("-", "")}/json/`
                })
                .then(({data}) => {
        
                    setFormValues(formElement, {
                        address: data.logradouro,
                        complement: data.complemento,
                        district: data.bairro,
                        city: data.localidade,
                        state: data.uf,
                    })
                    numberElement.focus()
                })
                .finally(() => {
                    btnZipcodeElement.disabled = false;
                    btnZipcodeElement.innerHTML = "Buscar";
                })
            }
        
            formElement.addEventListener("submit", e => {
                e.preventDefault()
            });
        
            zipcodeElement.addEventListener('keyup', e => {
                if(e.key === 'Enter' || e.target.value.length > 8){
                    searchZopcode()
                } 
            })
        
            btnZipcodeElement.addEventListener('click', e =>  searchZopcode)

            if (formElement) {
                formElement.addEventListener('submit', e => {

                    e.preventDefault()

                    const schedule_adrress = db.collection('schedule-address').doc(userId)

                    schedule_adrress.set({
                        "zipcode": zipcodeElement.value,
                        "address": addressElement.value,
                        "number": numberElement.value,
                        "complement": complementElement.value,
                        "district": districtElement.value,
                        "city": cityElement.value,
                        "state": stateElement.value
                    }).then(() => {
                        btnSuccess.classList.add('open')
                        setTimeout(() => {
                            window.location.href = '/'
                        }, 1000);
                    }).catch(error => console.log('Algo está errado', error))
                    
                })
            }

            db.collection('schedule-address')
                .doc(userId)
                .get()
                .then(doc => {
                    if (zipcodeElement) {
                        zipcodeElement.value = doc.data().zipcode
                    }

                    if (addressElement) {
                        addressElement.value = doc.data().address
                    }

                    if (numberElement) {
                        numberElement.value = doc.data().number
                    }

                    if (complementElement) {
                        complementElement.value = doc.data().complement
                    }

                    if (districtElement) {
                        districtElement.value = doc.data().district
                    }

                    if (cityElement) {
                        cityElement.value = doc.data().city
                    }

                    if (stateElement) {
                        stateElement.value = doc.data().state
                    }
                })
        
        } else {
            window.location.href = 'login.html'
        }
    })

})