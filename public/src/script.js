let hasAcc = false
const loginBox = document.querySelector(".login")
const enterAccount = document.querySelector("#enterAccount")
const signBox = document.querySelector(".sign")
const createAccount = document.querySelector("#createAccount")
const kanjiBox = document.querySelector(".form")
const createKanji = document.querySelector("#createKanji")
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

createKanji.addEventListener('click', async (e) => {
	e.preventDefault()

	console.log("criação de Kanji requisitada")
	const file = inputFile.files[0]

	if (validateFileType(file)) {
		//newBox vai pra função de objetificar o  kanji
		let newBox = document.createElement("article")
		const hir = document.querySelector("#hiragana").value
		const rom = document.querySelector("#romanji").value
		const mean = document.querySelector("#significado").value
		const uso = document.querySelector("#uso").value
		const imgSrc = URL.createObjectURL(file)

		const data = { hir, rom, mean, uso, imgSrc }
		const head = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		}

		try {
			const requisition = await fetch('/kanjiCreation', head)
			const result = await requisition.json()

			console.log(result)
		} catch (err) {
			throw err
		}
		//const kanji = new makeKanji(imgSrc, hir, rom, sig, uso, newBox)
	}



	kanjiBox.classList.add("close")
	kanjiForm.reset()
})

function openForm() {
	if (hasAcc) {
		resetAll()
		kanjiBox.classList.remove("close")
	} else {
		console.log('cade sua conta')
	}
}

function cancelForm() {
	

	resetAll()
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
	loginBox.classList.remove("close")
}

function resetAll() {
	loginBox.classList.add("close")
	signBox.classList.add("close")
	kanjiBox.classList.add("close")

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

		hasAcc = result.hasAcc
		console.log(result.message)
		if (hasAcc) {
			loginBox.classList.add("close")
			userForm.reset()
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
		}
	} catch (err) {
		throw err
	}
})