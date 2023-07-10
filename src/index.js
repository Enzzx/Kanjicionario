const newBox = document.createElement("article")
const formBtn = document.querySelector("#form-button")
const loginBox = document.querySelector(".login")
const signBox = document.querySelector(".sign")
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
    </section>
`
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
	console.log("abrir formulário de criação de kanji")
	formBox.classList.remove("close")
}

function cancelForm() {
	console.log("fechar")
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
	console.log("abrir formulário de sign in")
	loginBox.classList.add("close")
	signBox.classList.remove("close")
}

function openLogin() {
	console.log("abrir formulário de login")
	loginBox.classList.remove("close")
}

function enterAccount() {
	const user = document.querySelector("#userName").value
	const password = document.querySelector("#password").value
	console.log("entrar na conta")

	//loadData(email)
}

let data
async function loadData(email, senha) {
	let { data, error } = await supabase
		.from('users')
		.select()
		.eq('user_mail', email)
		.eq('user_password', senha)
		.single()
	
	if (data) {
		//console.log(data)
		return data
	}
	if (error) {
		console.log(error)
	}
			}
