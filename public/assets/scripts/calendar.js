import { endOfMonth, endOfWeek, format, startOfDay, startOfWeek } from "date-fns"
import {ptBR} from 'date-fns/locale'

document.querySelectorAll('.calendar').forEach(calendar => {

    const today = new Date()
    const startMonth = startOfDay(today)
    const startAt = startOfWeek(startMonth)
    const endAt = endOfWeek(endOfMonth(today))

    const title = calendar.querySelector('h2')
    const days = calendar.querySelector('.days')
    const btnToday = calendar.querySelector('.btn-today')
    const btnPrev = calendar.querySelector('.btn-prev')
    const btnNext = calendar.querySelector('.btn-next')

    btnToday.addEventListener('click', e => {
        
    })

    btnPrev.addEventListener('click', e => {

    })

    btnNext.addEventListener('click', e => {

    })

    const render = () => {

        title.innerHTML = format(startMonth, 'MMMM yyyy', {
            locale: ptBR
        })
    }

    render()
})