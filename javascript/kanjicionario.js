const formBtn = document.querySelector("#form-button")
const formBox = document.querySelector(".form")
const form = document.querySelector("form")
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

class makeKanji {
    constructor(img, hira, roma, sign, usso, nB) {
        document.body.children[3].appendChild(nB)
        nB.classList.add('kanji-box')
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
    const newBox = document.createElement("article")

    if (validateFileType(file)) {
        const imgSrc = URL.createObjectURL(file)
        const kanji = new makeKanji(imgSrc, hir, rom, sig, uso, newBox)
    }
    
    

    const formInterval = setInterval(() => {
        formBox.classList.add("open")
        form.reset()
        clearInterval(formInterval)
    }, 200)
}

function openForm() {
    console.log("abrir")
    formBox.classList.remove("open")
}

function cancelForm() {
	  console.log("fechar")
	  formInterval = setInterval(() => {
        formBox.classList.add("open")
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
