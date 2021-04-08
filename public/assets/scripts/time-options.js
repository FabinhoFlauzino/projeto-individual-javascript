import { format, parse } from "date-fns"
import { appendTemplate, getQueryString } from "./utils"
import {ptBR} from 'date-fns/locale'

const data = [{
    id:1,
    value: '9:00'
   }, {
       id:2,
       value:'10:00'
   }, {
       id:3,
       value:'11:00'
   }, {
       id:4,
       value:'12:00'
   }, {
       id:5,
       value:'13:00'
   }, {
       id:6,
       value:'14:00'
   }, {
       id:7,
       value:'15:00'
   }, {
       id:8,
       value:'16:00'
    }
]

const renderTimeOptions = context => {

    const targetElement = context.querySelector('.options')

    targetElement.innerHTML = ""

    data.forEach(item => {

        appendTemplate(
            targetElement,
            "label",
            `
                    <input type="radio" name="option" value="${item.value}">
                    <span>${item.value}</span>
            `
        )
    })
}

const validateSubmitForm = context => {
    const button = context.querySelector("[type=submit]")

    const checkValue = () => {
        if (context.querySelector("[name=option]:checked")) {
            button.disabled = false
        } else {
            button.disabled = true
        }
    };

    window.addEventListener("load", e => checkValue())

    context.querySelectorAll("[name=option]").forEach((input) => {
        input.addEventListener("change", e => {
            
            checkValue()
        });
    });

    context.querySelector("form").addEventListener("submit", e => {
        if (!context.querySelector("[name=option]:checked")) {
            button.disabled = true
            e.preventDefault()
        }
    });
};

document.querySelectorAll('#time-options').forEach(page => {
    renderTimeOptions(page)

    validateSubmitForm(page)

    const params = getQueryString()
    const title = page.querySelector('h3')
    const form = page.querySelector("form");
    const scheduleAt = parse(params.schedule_at, "yyyy-MM-dd", new Date())

    setFormValues(form, params)

    title.innerHTML = format(scheduleAt, "EEEE, d 'de' MMMM 'de' yyyy", {locale: ptBR})
    
})