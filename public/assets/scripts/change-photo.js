import Cropper from "cropperjs"
import firebase from "./firebase-app"

document.querySelectorAll("#change-photo").forEach((page) => {

    let cropper = null
    let userGlobal = null
    const imageElement = page.querySelector("#photo-preview")
    const buttonElement = page.querySelector(".choose-photo")
    const inputFileElement = page.querySelector("#file")
    const form = imageElement.closest("form")
    const btnSubmit = form.querySelector("[type=submit]")

    const auth = firebase.auth()

    auth.onAuthStateChanged(user => {

        if(user) {

            userGlobal = user
            imageElement.src = user.photoURL || "../../assets/images/default.png"
        }
    })

    form.addEventListener("submit", e => {

        e.preventDefault()

        form.classList.remove("cropping")

        btnSubmit.disabled = true
        btnSubmit.innerHTML = "Salvando..."

        imageElement.src = cropper.getCroppedCanvas().toDataURL("image/png")

        cropper.getCroppedCanvas().toBlob((blob) => {

            const storage = firebase.storage()

            const fileRef = storage.ref().child(`photos/${userGlobal.uid}.png`)

            fileRef
                .put(blob)
                .then(snapshot => snapshot.ref.getDownloadURL())
                .then(photoURL => userGlobal.updateProfile({ photoURL }))
                .then(() => {  
                    document.querySelector("#header > div.menu.logged > div > div > picture > a > img").src = userGlobal.photoURL
                })
                .finally(() => {
                    btnSubmit.disabled = false
                    btnSubmit.innerHTML = "Salvar"
                })
                
            cropper.destroy()
        })

    })


    imageElement.addEventListener("click", (e) => {
        inputFileElement.click()
    }) 

    buttonElement.addEventListener("click", (e) => {
        inputFileElement.click()
    })

    inputFileElement.addEventListener('change', e => {

        if (e.target.files.length) {
            const file = e.target.files[0]

            const reader = new FileReader()

            reader.onload = () => {

                imageElement.src = reader.result
                form.classList.add("cropping")

                cropper = new Cropper(imageElement), {
                    aspectRatio: 1/1
                }

            }

            reader.readAsDataURL(file)

            e.target.value = ""
        }
    })

})