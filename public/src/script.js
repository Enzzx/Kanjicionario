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
const warns = document.querySelectorAll(".warn")
let kuanjitity = document.querySelector("#kuanjitity")
let numKanjis = 0
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
	constructor(hira, roma, mean, usso, nB, btn) {
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
		nB.appendChild(btn)
	}
}

createKanji.addEventListener('click', async (e) => {
	e.preventDefault()

	console.log("criação de Kanji requisitada")
	const file = inputFile.files[0]

	if (validateFileType(file)) {
		const newBox = document.createElement("article")
		const hir = document.querySelector("#hiragana").value
		const rom = document.querySelector("#romanji").value
		const mean = document.querySelector("#significado").value
		const uso = document.querySelector("#uso").value
		const button = document.createElement("input")
		button.type = "button"
		button.value = "Excluir"
		button.addEventListener('click', async () => {
			// A PENSAR
		})
		//const imgSrc = URL.createObjectURL(file)

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
			numKanjis++
			kuanjitity.textContent = numKanjis
			const doKanji = new makeKanji(hir, rom, mean, uso, newBox, button)
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
	warns.forEach(warn => {
		warn.classList.remove('wrong')
	})

	userForm.reset()
	signForm.reset()
	kanjiForm.reset()
}


// - - -  REQUISIÇÕES DA DADOS  - - -

enterAccount.addEventListener('click', async (e) => {
	e.preventDefault()
	warns.forEach(warn => {
		warn.classList.remove('wrong')
	})

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
		nome = result.name
		hasAcc = result.hasAcc
		kanjisObj = result.result
		numKanjis = kanjisObj.length
		kuanjitity.textContent = numKanjis
		console.log(numKanjis)
		console.log(result.message)
		if (hasAcc) {
			loginBox.classList.add("close")
			userForm.reset()
			if (kanjisObj) {
				async function showKanji() {
					kanjisObj.forEach(kanjiFE)
				}
				showKanji()
			}
		} else if (nome) {
			warns[1].classList.add('wrong')
		} else {
			warns[0].classList.add('wrong')
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
					console.log(loginResponse.message)
					if (hasAcc) {
						signBox.classList.add("close")
						signForm.reset()
					}
				} catch (err) {
					throw err
				}
			}
			autoLog()
		} else {
			warns[2].classList.add('wrong')
		}
	} catch (err) {
		throw err
	}
})

function kanjiFE(kanji) {
	const idKanji = kanji.id_kanji
	const newBox = document.createElement("article")
	const hir = kanji.hir
	const rom = kanji.rom
	const mean = kanji.mean
	const uso = kanji.uso
	const button = document.createElement("input")
	button.type = "button"
	button.value = "Excluir"
	button.addEventListener('click', async () => {
		button.parentNode.style.opacity = '0.7'
		data = { idKanji }
		head = {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		}
		try {
			const removing = await fetch('/removeKanji', head)
			const removed = await removing.json()

			console.log(removed.message)
			const hideKanji = setInterval(() => {
				button.parentNode.remove()
				numKanjis--
				kuanjitity.textContent = numKanjis
				clearInterval(hideKanji)
			}, 200)
		} catch (err) {
			if (err) throw err;
		}
	})
	const doKanji = new makeKanji(hir, rom, mean, uso, newBox, button)
}