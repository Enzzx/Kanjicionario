
class makeKanji {
    constructor(hira, roma, capt, nB) {
        document.body.children[3].appendChild(nB)
        nB.classList.add('kanji-box')
        nB.innerHTML = `
          <p class="kanji-item">${hira}</p>
          <p class="kanji-item">${roma}</p>
          <p class="kanji-item">${capt}</p>
      `
    }
}

function createKanji() {
    console.log("criação de Kanji requerida")
    const hir = document.querySelector("#hiragana").value
    const rom = document.querySelector("#romanji").value
    const cap = document.querySelector("#caption").value
    const newBox = document.createElement("article")

    

    const $kanji = new makeKanji(hir, rom, cap, newBox)
}
