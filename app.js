const express = require("express")
const app = express()
const port = 8080
const mysql = require("mysql")

// - - -  BANCO DE DADOS  - - -
const con = mysql.createConnection({
    host: "localhost",
    user: "zenzx",
    password: "5142615enzo",
    database: "teste"
})
con.connect((err) => {
    if (err) throw err;
    console.log("DB tá na linha")
})

// - - -  USOS EXTERNOS  - - -
app.use(express.json())
app.use(express.static(__dirname))

// - - -  SERVIDOR  - - -
app.post("/logIn", (req, res) => {
    console.log(req.body)

    const user = req.body.user
    const password = req.body.password
    const srcId = "SELECT id_user FROM users WHERE name = ? AND password = ?;"
    const srcKanjis = "SELECT * FROM kanjis WHERE id_user = ?;"

    con.query(srcId, [user, password], (err, result) => {
        if (err) throw err;
        else if (result == "") {
            console.log('o valor inserido não existe')

            const response = {
                message: 'nome e/ou senha de usuário incorreto',
                hasAcc: false,
                reachKanjis: false
            }
            return res.status(401).json(response)
        }

        const id = result[0].id_user
        console.log(`id: ${id}`)

        con.query(srcKanjis, id, (err, result) => {
            if (err) throw err;
            else if (result == "") {
                console.log('sem kanjis')

                const response = {
                    message: 'nenhum kanji encontrado',
                    id: id,
                    hasAcc: true,
                    reachKanjis: false
                }
                return res.status(200).json(response)
            }

            console.log("kanjis encontrados:")
            console.log(result)

            const response = {
                message: 'requisição completa',
                id: id,
                hasAcc: true,
                reachKanjis: true,
                result: result
            }
            res.status(200).json(response)
        })
    })
})


app.post('/signUp', (req, res) => {
    console.log(req.body)

    const newUser = req.body.newUser
    const newPassword = req.body.newPassword
    const userExists = "SELECT * FROM users WHERE name = ?;"
    const doUser = "INSERT INTO users (name, password) VALUES (?, ?);"

    con.query(userExists, newUser, (err, result) => {
        if (err) throw err;
        else if (result != "") {
            console.log("este nome de usuário já está em uso")

            const response = {
                message: 'tente outro nome de usuário'
            }
            return res.status(401).json(response)
        }

        con.query(doUser, [newUser, newPassword], (err, result) => {
            if (err) throw err;
            console.log(`${result.affectedRows} novo usuário foi criado`)

            const response = {
                message: 'novo usuário criado',
                autoLogin: true
            }
            res.status(200).json(response)
        })
    })
})


app.post('/kanjiCreation', (req, res) => {
    console.log(req.body)

    const hir = req.body.hir
    const rom = req.body.rom
    const mean = req.body.mean
    const uso = req.body.uso
    const id = req.body.idUser
    const doKanji = "INSERT INTO kanjis (hir, rom, mean, uso, id_user) VALUES (?, ?, ?, ?, ?);"

    con.query(doKanji, [hir, rom, mean, uso, id], (err, result) => {
        if (err) throw err;
        console.log(`${result.affectedRows} novo kanji criado`)

        const response = {
            message: 'kanji criado com sucesso'
        }
        res.status(200).json(response)
    })

})


app.use((req, res) => {
    res.status(404).sendFile(__dirname + '/public/404.html')
})

app.listen(port, (err) => {
    if (err) throw err;
    console.log("servidor tá rodando")
})