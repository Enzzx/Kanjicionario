let hasAcc = false
let idUser = 0
const pfp = document.querySelector("#pfp")
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
const homeMessage = document.createElement("article")
homeMessage.id = "home-message"
homeMessage.innerHTML = "<h2>Entre em uma conta para utilizar o kanjicionário</h2>"
const noKanjiMessage = document.createElement("article")
noKanjiMessage.id = "no-kanji-message"
noKanjiMessage.innerHTML = "<h2>nenhum kanji criado ainda</h2>"
const searchbar = document.querySelector("#searchbar")
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


searchbar.addEventListener('input', (e) => {
	const romanjis = document.querySelectorAll(".search")

	romanjis.forEach(romanji => {
		if (romanji.textContent.toLowerCase().indexOf(searchbar.value.toLowerCase()) !== -1) {
			romanji.closest(".kanji-box").classList.remove('close-box')
		} else {
			romanji.closest(".kanji-box").classList.add('close-box')
		}
	})
})

// - - - - -   FORMULÁRIO   - - - - -
class makeKanji {
	constructor(hira, roma, mean, usso, img, nB, btn) {
		kanjiHouse.appendChild(nB)
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
                <p class="kanji-caption search">${roma}</p>
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

		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.addEventListener('load', async () => {
			const url = reader.result
			const data = { hir, rom, mean, uso, idUser, url }
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
				if (kanjiHouse.appendChild(noKanjiMessage)) {
					kanjiHouse.removeChild(noKanjiMessage)
				}
				const doKanji = new makeKanji(hir, rom, mean, uso, url, newBox, button)
			} catch (err) {
				throw err
			}
		})


		const button = document.createElement("input")
		button.type = "button"
		button.value = "Excluir"
		button.addEventListener('click', async () => {
			button.parentNode.style.opacity = '0.7'
			const data = { hir, rom, mean, uso, idUser }
			const head = {
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
					if (numKanjis === 0) {
						kanjiHouse.appendChild(noKanjiMessage)
					}
					clearInterval(hideKanji)
				}, 200)
			} catch (err) {
				throw err
			}
		})

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
window.onload = async () => {

	let userInfo = getCookie("userInfo")

	if (userInfo !== null) {
		userInfo = JSON.parse(decodeURIComponent(userInfo))
		console.log(userInfo)

		const head = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(userInfo)
		}

		try {
			const requisition = await fetch('/logIn', head)
			const result = await requisition.json()

			idUser = result.id
			nome = result.name
			hasAcc = result.hasAcc
			kanjisObj = result.result
			console.log(result.message)
			if (hasAcc) {
				pfp.src = 'public/images/pfp.png'
				while (kanjiHouse.firstChild) {
					kanjiHouse.removeChild(kanjiHouse.lastChild)
				}
				loginBox.classList.add("close")
				userForm.reset()
				kuanjitity.textContent = 0
				if (kanjisObj) {
					numKanjis = kanjisObj.length
					kuanjitity.textContent = numKanjis
					async function showKanji() {
						kanjisObj.forEach(kanjiFE)
					}
					showKanji()
				} else {
					kanjiHouse.appendChild(noKanjiMessage)
				}
			} else if (nome) {
				warns[1].classList.add('wrong')
			} else {
				warns[0].classList.add('wrong')
			}
		} catch (err) {
			throw err
		}
	}


	function getCookie(cookieName) {
		const cookies = document.cookie.split('; ')
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].split('=')
			if (cookie[0] === cookieName) {
				return cookie[1]
			}
		}
	}
}

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
	document.cookie = `userInfo=nada; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
	pfp.src = 'public/images/user.svg'
	idUser = 0
	hasAcc = false
	while (kanjiHouse.firstChild) {
		kanjiHouse.removeChild(kanjiHouse.firstChild)
	}
	kanjiHouse.appendChild(homeMessage)
	numKanjis = 0
	kuanjitity.textContent = numKanjis
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
		console.log(result.message)
		if (hasAcc) {
			const resCookie = JSON.stringify(data)
			let date = new Date()
			date.setDate(date.getDate() + 2)
			document.cookie = `userInfo=${resCookie}; expires=${date.toUTCString()}; path=/`

			pfp.src = 'public/images/pfp.png'
			while (kanjiHouse.firstChild) {
				kanjiHouse.removeChild(kanjiHouse.lastChild)
			}
			loginBox.classList.add("close")
			userForm.reset()
			kuanjitity.textContent = 0
			if (kanjisObj) {
				numKanjis = kanjisObj.length
				kuanjitity.textContent = numKanjis
				async function showKanji() {
					kanjisObj.forEach(kanjiFE)
				}
				showKanji()
			} else {
				kanjiHouse.appendChild(noKanjiMessage)
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
						const resCookie = JSON.stringify(data)
						let date = new Date()
						date.setDate(date.getDate() + 2)
						document.cookie = `userInfo=${resCookie}; expires=${date.toUTCString()}; path=/`

						pfp.src = 'public/images/pfp.png'
						while (kanjiHouse.firstChild) {
							kanjiHouse.removeChild(kanjiHouse.lastChild)
						}
						kanjiHouse.appendChild(noKanjiMessage)
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
	const url = kanji.imgpath
	const button = document.createElement("input")
	button.type = "button"
	button.value = "Excluir"
	button.addEventListener('click', async () => {
		button.parentNode.style.opacity = '0.7'
		data = { idKanji}
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
				if (numKanjis === 0) {
					kanjiHouse.appendChild(noKanjiMessage)
				}
				clearInterval(hideKanji)
			}, 200)
		} catch (err) {
			if (err) throw err;
		}
	})
	const doKanji = new makeKanji(hir, rom, mean, uso, url, newBox, button)
}
