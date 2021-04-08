import { addDays, addMonths, differenceInSeconds, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, subMonths } from "date-fns"
import {ptBR} from 'date-fns/locale'

document.querySelectorAll('#schedules-new').forEach(page => {

    const form = page.querySelector('form')
    const input = page.querySelector('[name=schedule_at]')
    const button = form.querySelector('[type=submit]')

    input.addEventListener('change', e => {
        if (e.target.value) {
            button.disabled = false
        } else {
            button.disabled = true
        }
    })

    form.addEventListener('submit', e => {

        if (!page.querySelector('[name=schedule_at]').value) {
            button.disabled = true
            e.preventDefault()
        }

    })
})

document.querySelectorAll('.calendar').forEach(calendar => {

    const today = new Date()
    let startMonth = startOfMonth(today)
    let startAt = startOfWeek(startMonth)
    let endAt = endOfWeek(endOfMonth(today))

    const title = calendar.querySelector('h2')
    const days = calendar.querySelector('.days')
    const btnToday = calendar.querySelector('.btn-today')
    const btnPrev = calendar.querySelector('.btn-prev')
    const btnNext = calendar.querySelector('.btn-next')

    btnToday.addEventListener('click', e => {
        startMonth = startOfMonth(today)
        startAt = startOfWeek(startMonth)
        endAt = endOfWeek(endOfMonth(startMonth))
        render()
    })

    btnPrev.addEventListener('click', e => {
        startMonth = subMonths(startMonth, 1)
        startAt = startOfWeek(startMonth)
        endAt = endOfWeek(endOfMonth(startMonth))

        render()
    })

    btnNext.addEventListener('click', e => {
        startMonth = addMonths(startMonth, 1)
        startAt = startOfWeek(startMonth)
        endAt = endOfWeek(endOfMonth(startMonth))

        render()
    })

    const render = () => {

        title.innerHTML = format(startMonth, 'MMMM yyyy', {
            locale: ptBR
        })

        days.innerHTML = ''

        let currentDay = new Date(startAt.getTime())

        while(differenceInSeconds(endAt, currentDay) > 0) {

            const li = document.createElement('li')

            li.innerHTML = format(currentDay, 'd')
            li.dataset.date = format(currentDay, 'yyyy-MM-dd')

            if (format(currentDay, 'yyyyMMdd') < format(today, 'yyyyMMdd')) {
                li.classList.add('month-prev')
                li.style.backgroundColor = "#DDD"
                li.style.cursor = "no-drop"
            } else {
                
                if(format(currentDay, 'yyyyMM') < format(startMonth, 'yyyyMM')) {
                    li.classList.add('month-prev')
                } else if(format(currentDay, 'yyyyMM') > format(startMonth, 'yyyyMM')) {
                    li.classList.add('month-next')
                } else if(format(currentDay, 'yyyyMMdd') === format(today, 'yyyyMMdd')) {
                    li.classList.add('active')
                }

                li.addEventListener('click', e => {
                    const { target } = e
                    const selected = calendar.querySelector('.selected')

                    if (selected) {
                        selected.classList.remove('selected')
                    }

                    target.classList.add('selected')

                    document.querySelector('[name=schedule_at]').value = target.dataset.date

                    const evt = document.createEvent('HTMLEvents')

                    evt.initEvent('change', false, true)

                    document.querySelector('[name=schedule_at]').dispatchEvent(evt)

                })
            }

            days.append(li)

            currentDay = addDays(currentDay, 1)
        }
    }

    render()
})