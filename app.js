const express = require("express")
const app = express()
const port = 8080
const path = require('path')
const fs = require('fs')
const { constants } = require("fs/promises")
const multer = require('multer')
const upload = multer({ dest: 'public/images/' })
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
    const srcId = "SELECT id_user, password FROM users WHERE name = ?;"
    const srcKanjis = "SELECT * FROM kanjis WHERE id_user = ?;"

    con.query(srcId, user, (err, result) => {
        if (err) throw err;
        else if (result == "") {
            console.log('o nome de usuário não existe')

            const response = {
                message: 'nome de usuário não existente',
                name: false,
                hasAcc: false,
            }
            return res.status(401).json(response)
        }

        const realPassword = result[0].password
        if (password == realPassword) {
            const id = result[0].id_user
            console.log(`id: ${id}`)

            con.query(srcKanjis, id, (err, result) => {
                if (err) throw err;
                else if (result == "") {
                    console.log('sem kanjis')

                    const response = {
                        message: 'nenhum kanji encontrado',
                        id: id,
                        name: true,
                        hasAcc: true,
                    }
                    return res.status(200).json(response)
                }

                console.log("kanjis encontrados:")
                console.log(result)

                const response = {
                    message: 'requisição completa',
                    id: id,
                    name: true,
                    hasAcc: true,
                    result: result
                }
                res.status(200).json(response)
            })
        } else {
            const response = {
                message: 'senha errada',
                name: true,
                hasAcc: false
            }
            res.status(401).json(response)
        }
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


app.post('/kanjiCreation', upload.single('img'), (req, res) => {
    console.log(req)
    const data = JSON.parse(req.body.data)
    const id = data.idUser
    // - - -  GUARDANDO IMAGEM  - - -
    const filePath = req.file.path
    const nameImg = req.file.originalname
    const storage = `public/images/${id}`

    try {
        fs.accessSync(storage, constants.F_OK)
    } catch (err) {
        if (err.code === 'ENOENT') {
            fs.mkdirSync(storage)
        } else {
            console.error(err)
        }
    }
    const actualPath = path.join(storage, nameImg)
    fs.copyFileSync(filePath, actualPath)
    fs.unlink(filePath, (err) => {
        console.error(err)
    })
    console.log(actualPath)

    // - - -  GUARDANDO NO BANCO DE DADOS  - - -
    const hir = data.hir
    const rom = data.rom
    const mean = data.mean
    const uso = data.uso
    const doKanji = "INSERT INTO kanjis (hir, rom, mean, uso, imgPath, id_user) VALUES (?, ?, ?, ?, ?, ?);"

    con.query(doKanji, [hir, rom, mean, uso, actualPath, id], (err, result) => {
        if (err) throw err;
        console.log(`${result.affectedRows} novo kanji criado`)

        const response = {
            message: 'kanji criado com sucesso'
        }
        res.status(200).json(response)
    })

})

app.delete('/deleteAccount', (req, res) => {
    const idUser = req.body.idUser
    const directory = `public/images/${idUser}`
    const deleteKanjis = "DELETE FROM kanjis WHERE id_user = ?;"
    const deleteUser = "DELETE FROM users WHERE id_user = ?;"
    console.log(`ID a ser deletado: ${idUser}`)

    con.query(deleteKanjis, idUser, (err, result) => {
        if (err) throw err;
        console.log("kanjis deletados")

        con.query(deleteUser, idUser, (err, result) => {
            if (err) throw err;
            console.log("usuário deletado")

            fs.readdir(directory, (err, files) => {
                if (err) throw err;

                if (files.length !== 0) {
                    for (let file of files) {
                        const filePath = path.join(directory, file)

                        fs.unlinkSync(filePath, (err) => {
                            if (err) throw err;
                        })
                    }
                }

                fs.rmdir(directory, (err) => {
                    if (err) throw err;
                })
            })


            const response = {
                message: "Conta deletada com sucesso"
            }
            res.status(200).json(response)
        })
    })
})

app.delete('/removeKanji', (req, res) => {
    const idKanji = req.body.idKanji
    const path = req.body.path
    const deleteKanji = "DELETE FROM kanjis WHERE id_kanji = ?;"

    con.query(deleteKanji, idKanji, (err, result) => {
        if (err) throw err;
        console.log("kanji deletado com sucesso")

        fs.unlink(path, (err) => {
            console.log(err)
        })
        const response = {
            message: 'kanji deletado'
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