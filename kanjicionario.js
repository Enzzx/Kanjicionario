const formBtn = document.querySelector("#form-button")
const form = document.querySelector(".form")

class makeKanji {
    constructor(hira, roma, sign, usso, nB) {
        document.body.children[3].appendChild(nB)
        nB.classList.add('kanji-box')
        nB.innerHTML = `
          <section class="top-box">
                <article>
        	  		<img src="#" alt="kanji">
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
    const hir = document.querySelector("#hiragana").value
    const rom = document.querySelector("#romanji").value
    const sig = document.querySelector("#significado").value
    const uso = document.querySelector("#uso").value
    const newBox = document.createElement("article")

    const kanji = new makeKanji(hir, rom, sig, uso, newBox)

    const formInterval = setInterval(() => {
        form.classList.add("open")
        clearInterval(formInterval)
    }, 200)
}

function openForm() {
    console.log("abrir")
    form.classList.remove("open")
}

function cancelForm() {
	  console.log("fechar")
	  formInterval = setInterval(() => {
        form.classList.add("open")
        clearInterval(formInterval)
    }, 200)
}
