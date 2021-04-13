export function appendTemplate(element, tagName, html) {

    const wrapElement = document.createElement(tagName)

    wrapElement.innerHTML = html

    element.append(wrapElement)

    return wrapElement
}

export function getQueryString() {

    const queryString = {}

    if (window.location.search) {
        window.location.search
            .split("?")[1]
            .split("&")
            .forEach((param) => {
                param = param.split("=")

                queryString[param[0]] = decodeURIComponent(param[1])
            })
    }

    return queryString
}

export function setFormValues(form, values) {
    Object.keys(values).forEach((key) => {
        const field = form.querySelector(`[name=${key}]`)

        switch (field.type) {
            case "select":
                field.querySelector(
                    `option[value=${values[key]}]`
                ).selected = true
                break
            case "checkbox":
            case "radio":
                form.querySelector(
                    `[name=${key}][value=${values[key]}]`
                ).checked = true
                break
            default:
                field.value = values[key]
        }
    })
}

export function getFormValues(form) {
    const values = {}

    form.querySelectorAll("[name]").forEach((field) => {
        switch (field.type) {
            case "select":
                values[field.name] = field.querySelector(
                    "option:selected"
                )?.value
                break
            case "radio":
                values[field.name] = form.querySelector(
                    `[name=${field.name}]:checked`
                )?.value
                break
            case "checkbox":
                values[field.name] = []
                form.querySelectorAll(`[name=${field.name}]:checked`).forEach(
                    (checkbox) => {
                        values[field.name].push(checkbox.value)
                    }
                )
                break
            default:
                values[field.name] = field.value
        }
    })

    return values
}

export function hideAlertError(form) {
    const alertElement = form.querySelector(".alert.danger")

    alertElement.style.display = "none"
}

export function showAlertError(form) {
    return (error) => {
        const alertElement = form.querySelector(".alert.danger")

        alertElement.innerHTML = error.message
        alertElement.style.display = "block"
    }
}

export function formatCurrency(value) {
    return parseFloat(value).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
    })
}

export function onSnapshotError(error) {

    const pathname = encodeURIComponent(window.location.pathname)
    const search = encodeURIComponent(window.location.search)

    window.location.href = `/auth.html?url=${pathname}${search}`
}