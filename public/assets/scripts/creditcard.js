import IMask from 'imask'
import { getQueryString, setFormValues, formatCurrency, appendTemplate } from './utils'
import firebase from './firebase-app'

const db = firebase.firestore()
const auth = firebase.auth()

const values = sessionStorage.getItem('values')
const valuesObj = JSON.parse(values)
const value = parseFloat(sessionStorage.getItem('price'))
const scheduleAt = document.querySelector('[name=schedule_at]')

document.querySelectorAll('#schedules-payment').forEach(page => {

    auth.onAuthStateChanged(user => {

        if (user) {
            const installments = page.querySelector('#installments')
            const btnOpen = page.querySelector('#btn-summary-toggle')
            const form = page.querySelector('form')
            const number = page.querySelector('#number')
            const cardName = page.querySelector('#cardName')
            const expiry = page.querySelector('#expiry')
            const inputCvv = page.querySelector('#cvv')
            const creditCard = page.querySelector('#credit-card')
            const svgCvv = page.querySelector('svg .cvv')
            const svgName = page.querySelector('svg .name')
            const svgNumber1 = page.querySelector('svg .number-1')
            const svgNumber2 = page.querySelector('svg .number-2')
            const svgNumber3 = page.querySelector('svg .number-3')
            const svgNumber4 = page.querySelector('svg .number-4')
            const svgExpiry = page.querySelector('svg .expiry')
            const btnSubmit = page.querySelector('[type=submit]')

            console.log(scheduleAt);

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

            if (!value) {
                page.querySelector("span.total").innerHTML = "R$ 0,00";
            } else {
                page.querySelector("span.total").innerHTML = formatCurrency(value);
            }

            setFormValues(form, getQueryString())

            number.addEventListener('keyup', e => {

                const numberString = number.value.replaceAll(' ', '')

                svgNumber1.innerHTML = numberString.substr(0, 4)
                svgNumber2.innerHTML = numberString.substr(4, 4)
                svgNumber3.innerHTML = numberString.substr(8, 4)
                svgNumber4.innerHTML = numberString.substr(12, 4)
            })

            cardName.addEventListener('keyup', e => {
                svgName.innerHTML = cardName.value.toUpperCase()
            })

            expiry.addEventListener('keyup', e => {
                svgExpiry.innerHTML = expiry.value
            })

            inputCvv.addEventListener('keyup', e => {
                svgCvv.innerHTML = inputCvv.value
            })

            creditCard.addEventListener('click', e => {

                creditCard.classList.toggle('flipped')

            })

            inputCvv.addEventListener('focus', e => {
                creditCard.classList.add('flipped')
            })

            inputCvv.addEventListener('blur', e => {
                creditCard.classList.remove('flipped')
            })

            new IMask(number, {
                mask: '0000 0000 0000 0000'
            })

            new IMask(expiry, {
                mask: 'MM/YY',
                lazy: false,

                blocks: {
                    YY: {
                        mask: IMask.MaskedRange,
                        from: 21,
                        to: 30
                    },
                    MM: {
                        mask: IMask.MaskedRange,
                        from: 1,
                        to: 12
                    }
                }
            })

            new IMask(inputCvv, {
                mask: '000[0]'
            })

            if (installments) {
                installments.innerHTML = ''

                for (let i = 1; i <= 4; i++) {
                    const option = document.createElement('option')
                    let result = eval(value / i)
                    option.innerHTML = `${i}x sem juros de ${result.toLocaleString('pt-br', {
                        style: 'currency',
                        currency: 'BRL'
                    })}`
                    installments.append(option)

                }
            }

            if (btnSubmit) {
                btnSubmit.addEventListener('click', e => {

                    e.preventDefault()

                    paymentProcess('Aguarde um instante, Falta Pouco...')

                    document.querySelector('aside').innerHTML = ''

                    saveOrder(values, value)


                })
            }

            btnOpen.addEventListener('click', e => {
                page.querySelector('aside').classList.toggle('open')
            })

        } else {
            window.location.href = 'login.html'
        }
    })


})

const paymentProcess = (message) => {
    document.querySelector('#schedules-payment aside').innerHTML = `
        <div class='paymentProcess'>
            <p>${message}</p>
        </div>
        <div class='lds-grid'>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    `
}

const saveOrder = (values, value) => {

    auth.onAuthStateChanged(user => {

        if (user) {

            values = JSON.parse(sessionStorage.getItem('values'))
            value = parseFloat(sessionStorage.getItem('price'))

            console.log(valuesObj)
            console.log(values)
            console.log(value)

            const date = new Date()
            const day = date.getDate().toString()
            const month = date.getMonth().toString()
            const year = date.getFullYear().toString()
            const hour = date.getHours().toString()
            const minute = date.getMinutes().toString()
            const second = date.getSeconds().toString()
            let orderID = year + month + day + hour + minute + second

            const pedidos = db.collection(`pedidos/${user.uid}/orders`).doc(orderID)

            pedidos.set({
                client_id: user.uid,
                date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
                timestamp: Date.now() / 1000 | 0 + 100,
                id: parseInt(orderID),
                consultation_date: scheduleAt.value,
                item: values,
                value: value,
                cardName: cardName.value,
                cardNumber: number.value,
                cardExpires: expiry.value,
                inputCvv: cvv.value
            })

            paymentProcess('Processando Pagamento.....')

            setTimeout(() => {
                window.location.href = 'schedules-address.html'
            }, 3000)

        }
    })

}