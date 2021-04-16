import { appendTemplate } from "./utils"
import firebase from './firebase-app'

const renderAddress = (context, addressOptions) => {

    const addressEl = context.querySelector('.addresses')

    addressEl.innerHTML = ''

    addressOptions.forEach(item => {
        
        appendTemplate(addressEl, 'label', 
            `
                <div>
                    <input type="radio" name="address" value="${item.id}" />
                    <address>
                        <strong>${item.address}, ${item.number}</strong><br />
                        ${item.district}<br />
                        ${item.city} - ${item.state}<br />
                        ${item.zipcode}
                    </address>
                </div>
                <a href="schedules-address-create.html" class="btn-update">Editar</a>
            `
        )
    })

}

document.querySelectorAll('#schedules-address').forEach((page) => {

    const db = firebase.firestore()

    db.collection('schedule-address').onSnapshot(snapshot => {

        const addressOptions = []

        snapshot.forEach(item => {
            addressOptions.push(item.data())
        })

        renderAddress(page, addressOptions)
    })

})


