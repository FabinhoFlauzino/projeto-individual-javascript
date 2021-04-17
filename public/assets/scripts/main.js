import firebase from './firebase-app'

const body = document.querySelector('body')
const btnOpen = document.querySelector('#btn-open')
const closeMenu = document.querySelectorAll('[data-close = "menu"]')
const menuLinks = document.querySelectorAll('.menu a')
const menu = document.querySelector("#header .menu")
const btnLogout = document.querySelector("#header .menu .footer button")
const auth = firebase.auth()

if (btnLogout) {
    btnLogout.addEventListener("click", e => {
        auth.signOut()
            .then(() => {
                window.location.href = "/"
            })
            .catch(err => window.location.href = '404.html')
    })
}

if (menu) {
    auth.onAuthStateChanged(user => {
        if (user) {
            const userElement = menu.querySelector(".footer > div > div")
            userElement.querySelector("strong").innerHTML = user.displayName
            userElement.querySelector("small").innerHTML = user.email
            userElement.closest(".footer").querySelector("img").src = user.photoURL || "../../assets/images/default.png"
            //userElement.closest(".footer").querySelector("img").src = user.photoURL || "../images/default.png"
            menu.classList.add("logged")
        } else {
            menu.classList.remove("logged")
        }
    })
}

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