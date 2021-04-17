import firebase from './firebase-app'
import { appendTemplate, formatCurrency } from './utils'

const values = sessionStorage.getItem('values')
const valuesObj = JSON.parse(values)

const info = sessionStorage.getItem('info')
const infoObj = JSON.parse(info)

document.querySelectorAll('#schedules-summary').forEach(page => {

    
    
    const auth = firebase.auth()
    const btnOpen = page.querySelector('#btn-summary-toggle')
   
    auth.onAuthStateChanged(user => {

        if (user) {

            const value = parseFloat(sessionStorage.getItem('price'))

            !value ? page.querySelector("span.total").innerHTML = "R$ 0,00" : 
                     page.querySelector("span.total").innerHTML = formatCurrency(value)

            btnOpen.addEventListener('click', e => {
                page.querySelector('aside').classList.toggle('open')
            })
            
            if (valuesObj) {
                
                const tBody = page.querySelector('tbody')

                tBody.innerHTML = ''

                valuesObj.forEach(item => {

                    appendTemplate(
                        tBody,
                        "tr",
                        `
                            <td>${item.name}</td>
                            <td>R$ ${item.price}</td>
                        `
                    )
                })
            }

            if (infoObj) {
                
                const main = page.querySelector('main')
                let str
                
                main.innerHTML = ''

                infoObj.filter(item => {
                    
                    str = item.cardNumber.substr(15, 4)

                    appendTemplate(
                        main,
                        "form",
                        `
                            <div class="field">
                                <input type="text" name="payment" id="payment" readonly value="Cartão de Crédito" />
                                <label for="payment">Forma de Pagamento</label>
                            </div>
    
                            <div class="field">
                                <input type="text" name="creditcard" id="creditcard" readonly value="**** ${str}" />
                                <label for="creditcard">Cartão Final</label>
                            </div>
    
                            <div class="field">
                                <input type="text" name="installments" id="installments" readonly value="${item.installments}" />
                                <label for="installments">Parcelas</label>
                            </div>
    
                            <div class="field">
                                <input type="text" name="total" id="total" readonly value="${formatCurrency(value)}" />
                                <label for="total">Valor Total</label>
                            </div>
    
                            <footer class="fixed">

                                <button type="submit">Continuar</button>
                            </footer>
                        `
                    )
                })
            }

            const btnSubmit = document.querySelector('[type=submit]')

            if (btnSubmit) {
                btnSubmit.addEventListener('click', e => {
                    e.preventDefault()

                    window.location.href = '/schedules-complete.html'
                })
            }
            
        } else {
            window.location.href = '/'
        }
    })

})