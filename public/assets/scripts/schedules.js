import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import firebase from './firebase-app'
import { appendTemplate, onSnapshotError, formatCurrency } from './utils'

const db = firebase.firestore()
const auth = firebase.auth()

let userId
const orders = []

const renderSchedules = (context, schedulesOptions) => {

    const nextEl = context.querySelector('ul')

    nextEl.innerHTML = ''

    schedulesOptions.forEach(item => {

        let items = item.item
        let services = []
        
        for (let i = 0; i < items.length; i++) {
            services = items[i];  
        }

        appendTemplate(
            nextEl,
            'li',
            `
                <li>
                    <section>

                        <div>
                            <label>Número do Protocolo</label>
                            <span>${item.id}</span>
                        </div>
                        <div>
                            <label>Data</label>
                            <span>${format(parseISO(item.consultation_date), 'dd/MM/yyyy', {locale: ptBR})} às ${item.option}</span>
                        </div>
                        <div>
                            <label>Status</label>
                            <span>Confirmado</span>
                        </div>
                        <div>
                            <label>Valor</label>
                            <span>${formatCurrency(item.value)}</span>
                        </div>
                        <div class="service">
                            <label>Serviço</label>
                            <span>${services.name}</span>
                        </div>
                        
                    </section>
                </li>
            `
        )
    })
}

document.querySelectorAll('#schedules').forEach(page => {

    auth.onAuthStateChanged(user => {

        if (user) {
            userId = user.uid
        }

        db.collection(`/pedidos/${userId}/orders`).onSnapshot(snapshot => {

            snapshot.forEach(item => {
                orders.push(item.data())
            })

            renderSchedules(page, orders)
        }, onSnapshotError)

    })
})