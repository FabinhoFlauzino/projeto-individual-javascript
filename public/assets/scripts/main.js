const body = document.querySelector('body')
const btnOpen = document.querySelector('#btn-open')
const closeMenu = document.querySelectorAll('[data-close = "menu"]')
const menuLinks = document.querySelectorAll('.menu a')

if (btnOpen) {
    btnOpen.addEventListener('click', e => {
        body.classList.add('open-menu')
    })
}

if (closeMenu) {
    closeMenu.forEach(el => {
        el.addEventListener('click', e => {
            body.classList.remove('open-menu')
        })
    })
}

if (menuLinks) {
    menuLinks.forEach(el => {
        el.addEventListener('click', e => {
            body.classList.remove('open-menu')
        })
    })
}