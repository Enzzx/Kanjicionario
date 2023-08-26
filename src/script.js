const newBox = document.createElement("article")
const formBtn = document.querySelector("#form-button")
const loginBox = document.querySelector(".login")
const enterAccount = document.querySelector("#enterAccount")
const signBox = document.querySelector(".sign")
const createAccount = document.querySelector("#createAccount")
const formBox = document.querySelector(".form")
const userForm = document.querySelector("#userForm")
const signForm = document.querySelector("#signForm")
const kanjiForm = document.querySelector("#kanjiForm")
const inputFile = document.querySelector("#file")
const fileTypes = [
	"image/apng",
	"image/bmp",
	"image/gif",
	"image/jpeg",
	"image/pjpeg",
	"image/png",
	"image/svg+xml",
	"image/tiff",
	"image/webp",
	"image/x-icon"
]
// - - - - -   FORMULÁRIO   - - - - -
class makeKanji {
	constructor(img, hira, roma, sign, usso, nB) {
		document.body.children[5].appendChild(nB)
		nB.classList.add("kanji-box")
		nB.innerHTML = `
  <section class="top-box">
        <article>
              <img src="${img}" alt="kanji">
        </article>
          <article>
            <aside>
                <h3 class="kanji-item">Hiragana</h3>
                <p class="kanji-caption">${hira}</p>
            </aside>
            <aside>
                <h3 class="kanji-item">Romanji</h3>
                <p class="kanji-caption">${roma}</p>
            </aside>
        </article>
    </section>
    <section class="bottom-box">
        <aside>
            <h3 class="kanji-item">Significado literal</h3>
               <p class="kanji-caption">${sign}</p>
        </aside>
        <aside>
             <h3 class="kanji-item">Uso</h3>
            <p class="kanji-caption">${usso}</p>
        </aside>
    </section>`
	}
}

function createKanji() {

	console.log("criação de Kanji requerida")
	const file = inputFile.files[0]
	const hir = document.querySelector("#hiragana").value
	const rom = document.querySelector("#romanji").value
	const sig = document.querySelector("#significado").value
	const uso = document.querySelector("#uso").value

	if (validateFileType(file)) {
		const imgSrc = URL.createObjectURL(file)
		const kanji = new makeKanji(imgSrc, hir, rom, sig, uso, newBox)
	}



	const formInterval = setInterval(() => {
		formBox.classList.add("close")
		kanjiForm.reset()
		clearInterval(formInterval)
	}, 200)
}

function openForm() {
	formBox.classList.remove("close")
	loginBox.classList.add("close")
	signBox.classList.add("close")
}

function cancelForm() {
	const formInterval = setInterval(() => {
		loginBox.classList.add("close")
		signBox.classList.add("close")
		formBox.classList.add("close")

		userForm.reset()
		signForm.reset()
		kanjiForm.reset()
		clearInterval(formInterval)
	}, 200)
}

function validateFileType(file) {
	if (fileTypes.includes(file.type)) {
		return true
	} else {
		console.error("file type not accepted")
	}
}

// - - - - -   USUÁRIO   - - - - -

function openSign() {
	loginBox.classList.add("close")
	formBox.classList.add("close")
	signBox.classList.remove("close")
}

function openLogin() {
	loginBox.classList.remove("close")
	signBox.classList.add("close")
	formBox.classList.add("close")
}

enterAccount.addEventListener('click', async (e) => {
	e.preventDefault()

	const user = document.querySelector('#userName').value
	const password = document.querySelector('#password').value

	const data = { user, password }
	const head = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	}
	try {
		const requisition = await fetch('/logIn', head)
		const result = await requisition.json()

		console.log(result.message)
	} catch (err) {
		console.log(err)
	}
})

createAccount.addEventListener('click', async (e) => {
	e.preventDefault()

	const newUser = document.querySelector('#newName').value
	const newPassword = document.querySelector('#newPassword').value

	let data = { newUser, newPassword }
	let head = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	}
	try {
		const requisition = await fetch('/signUp', head)
		const result = await requisition.json()

		let message = result.message
		let autoLogin = result.autoLogin
		console.log(message)
		if (autoLogin) {
			async function autoLog() {
				console.log('loging automático')

				const user = newUser
				const password = newPassword
				data = { user, password }
				head = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data)
				}
                try {
                    const doLogin = await fetch('/logIn', head)
                    const loginResponse = await doLogin.json()

					console.log(loginResponse.message)
				} catch (err) {
					console.log(err)
				}
            }
			autoLog()
		}
	} catch (err) {
		throw err
	}
})