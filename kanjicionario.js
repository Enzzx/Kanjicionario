const formBtn = document.querySelector("#form-button")
const form = document.querySelector(".form")

class makeKanji {
    constructor(hira, roma, capt, nB) {
        document.body.children[3].appendChild(nB)
        nB.classList.add('kanji-box')
        nB.innerHTML = `
          <aside>
            <h3 class="kanji-item">Hiragana</h3>
            <p class="kanji-caption">${hira}</p>
        </aside>
        <aside>
            <h3 class="kanji-item">Romanji</h3>
            <p class="kanji-caption">${roma}</p>
        </aside>
        <aside>
            <h3 class="kanji-item">Caption</h3>
            <p class="kanji-caption">${capt}</p>
        </aside>
        `
    }
}

function createKanji() {
    console.log("criação de Kanji requerida")
    const hir = document.querySelector("#hiragana").value
    const rom = document.querySelector("#romanji").value
    const cap = document.querySelector("#caption").value
    const newBox = document.createElement("article")

    const kanji = new makeKanji(hir, rom, cap, newBox)

    const formInterval = setInterval(() => {
        form.classList.add("open")
        clearInterval(formInterval)
    }, 200)
}

function openForm() {
    console.log("abrir")
    form.classList.remove("open")
}