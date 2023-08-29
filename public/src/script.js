let hasAcc = false
let idUser = 0
const loginBox = document.querySelector(".login")
const enterAccount = document.querySelector("#enterAccount")
const signBox = document.querySelector(".sign")
const createAccount = document.querySelector("#createAccount")
const kanjiBox = document.querySelector(".form")
const createKanji = document.querySelector("#createKanji")
const userForm = document.querySelector("#userForm")
const signForm = document.querySelector("#signForm")
const kanjiForm = document.querySelector("#kanjiForm")
const acc = document.querySelector(".acc")
const noAcc = document.querySelector(".no-acc")
const kanjiHouse = document.querySelector("#kanji-house")
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
	constructor(hira, roma, mean, usso, nB) {
		kanjiHouse.appendChild(nB)
		nB.classList.add("kanji-box")
		nB.innerHTML = `
  <section class="top-box">
        <article>
              <img src="public/images/f488.jpg" alt="kanji">
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
               <p class="kanji-caption">${mean}</p>
        </aside>
        <aside>
             <h3 class="kanji-item">Uso</h3>
            <p class="kanji-caption">${usso}</p>
        </aside>
    </section>`
	}
}

createKanji.addEventListener('click', async (e) => {
	e.preventDefault()

	console.log("criação de Kanji requisitada")
	const file = inputFile.files[0]

	if (validateFileType(file)) {
		let newBox = document.createElement("article")
		const hir = document.querySelector("#hiragana").value
		const rom = document.querySelector("#romanji").value
		const mean = document.querySelector("#significado").value
		const uso = document.querySelector("#uso").value
		const imgSrc = URL.createObjectURL(file)

		const data = { hir, rom, mean, uso, idUser }
		const head = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		}

		try {
			const requisition = await fetch('/kanjiCreation', head)
			const result = await requisition.json()

			console.log(result)
			const showKanji = new makeKanji(hir, rom, mean, uso, newBox)
		} catch (err) {
			throw err
		}
	}



	kanjiBox.classList.add("close")
	kanjiForm.reset()
})

function openForm() {
	if (hasAcc) {
		resetAll()
		kanjiBox.classList.remove("close")
	} else {
		resetAll()
		noAcc.classList.remove('close')
	}
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
	resetAll()
	signBox.classList.remove("close")
}

function openLogin() {
	resetAll()
	if (idUser) {
		acc.classList.remove('close')
	} else {
		loginBox.classList.remove("close")
	}
}

function getOut() {
	idUser = 0
	hasAcc = false
	while (kanjiHouse.firstChild) {
		kanjiHouse.removeChild(kanjiHouse.firstChild)
	}
	resetAll()
}

async function removeAcc() {
	const data = { idUser }
	const head = {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	}
	try {
		const deleting = await fetch('/deleteAccount', head)
		const deleted = await deleting.json()

		console.log(deleted.message)
		getOut()
	} catch (err) {
		throw err;
	}
}

function resetAll() {
	loginBox.classList.add("close")
	signBox.classList.add("close")
	kanjiBox.classList.add("close")
	acc.classList.add('close')
	noAcc.classList.add('close')

	userForm.reset()
	signForm.reset()
	kanjiForm.reset()
}


// - - -  REQUISIÇÕES DA DADOS  - - -

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

		idUser = result.id
		hasAcc = result.hasAcc
		kanjisObj = result.result
		console.log(result)
		if (hasAcc) {
			loginBox.classList.add("close")
			userForm.reset()
			async function doKanji() {
				kanjisObj.forEach(kanji => {
					let newBox = document.createElement("article")
					const hir = kanji.hir
					const rom = kanji.rom
					const mean = kanji.mean
					const uso = kanji.uso
					const doKanji = new makeKanji(hir, rom, mean, uso, newBox)
				})
			}
			doKanji()
		}
	} catch (err) {
		throw err
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
				console.log('login automático')

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

					idUser = loginResponse.id
					hasAcc = loginResponse.hasAcc
					kanjisObj = loginResponse.result
					console.log(loginResponse.message)
					if (hasAcc) {
						signBox.classList.add("close")
						signForm.reset()
						async function doKanji() {
							kanjisObj.forEach(kanji => {
								let newBox = document.createElement("article")
								const hir = kanji.hir
								const rom = kanji.rom
								const mean = kanji.mean
								const uso = kanji.uso
								const doKanji = new makeKanji(hir, rom, mean, uso, newBox)
							})
						}
						doKanji()
					}
				} catch (err) {
					throw err
				}
			}
			autoLog()
		}
	} catch (err) {
		throw err
	}
})