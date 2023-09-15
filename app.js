const express = require("express");
const app = express();
const port = 8080;
const { Pool } = require('pg');

// - - -  BANCO DE DADOS  - - -
const pool = new Pool({
    user: 'zenzx',
    host: 'dpg-cjnro44dfrcc739n887g-a',
    database: 'kanjicionario_db',
    password: '7rrdC1g3aRVUf9yjNw1h3N3LE60MFqPs',
    port: 5432
});

pool.connect()
    .then(() => {
        console.log("DB tá na linha");
    })
    .catch(err => {
        console.error(err);
    });

// - - -  USOS EXTERNOS  - - -
app.use(express.json({ limit: '100mb' }));
app.use(express.static(__dirname));
app.use(express.urlencoded({ limit: '100mb' }));

// - - -  SERVIDOR  - - -
app.post("/logIn", async (req, res) => {
    console.log(req.body);

    const user = req.body.user;
    const password = req.body.password;
    const srcId = "SELECT id_user, password FROM users WHERE name = $1;";
    const srcKanjis = "SELECT * FROM kanjis WHERE id_user = $1;";

    try {
        const idResult = await pool.query(srcId, [user]);

        if (idResult.rows.length === 0) {
            console.log('o nome de usuário não existe');

            const response = {
                message: 'nome de usuário não existente',
                name: false,
                hasAcc: false,
            };
            return res.status(401).json(response);
        }

        const realPassword = idResult.rows[0].password;
        if (password === realPassword) {
            const id = idResult.rows[0].id_user;
            console.log(`id: ${id}`);

            const kanjisResult = await pool.query(srcKanjis, [id]);

            if (kanjisResult.rows.length === 0) {
                console.log('sem kanjis');

                const response = {
                    message: 'nenhum kanji encontrado',
                    id: id,
                    name: true,
                    hasAcc: true,
                };
                return res.status(200).json(response);
            }

            console.log("kanjis encontrados:");
            console.log(kanjisResult.rows);

            const response = {
                message: 'requisição completa',
                id: id,
                name: true,
                hasAcc: true,
                result: kanjisResult.rows
            };
            res.status(200).json(response);
        } else {
            const response = {
                message: 'senha errada',
                name: true,
                hasAcc: false
            };
            res.status(401).json(response);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

app.post('/signUp', async (req, res) => {
    console.log(req.body);

    const newUser = req.body.newUser;
    const newPassword = req.body.newPassword;
    const userExists = "SELECT * FROM users WHERE name = $1;";
    const doUser = "INSERT INTO users (name, password) VALUES ($1, $2);";

    try {
        const userCheckResult = await pool.query(userExists, [newUser]);

        if (userCheckResult.rows.length !== 0) {
            console.log("este nome de usuário já está em uso");

            const response = {
                message: 'tente outro nome de usuário'
            };
            return res.status(401).json(response);
        }

        await pool.query(doUser, [newUser, newPassword]);
        console.log(`Novo usuário foi criado`);

        const response = {
            message: 'novo usuário criado',
            autoLogin: true
        };
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

app.post('/kanjiCreation', async (req, res) => {
    const data = req.body;
    const id = data.idUser;

    // - - -  GUARDANDO NO BANCO DE DADOS  - - -
    const hir = data.hir;
    const rom = data.rom;
    const mean = data.mean;
    const uso = data.uso;
    const url = data.url
    const doKanji = "INSERT INTO kanjis (hir, rom, mean, uso, imgpath, id_user) VALUES ($1, $2, $3, $4, $5, $6);";

    try {
        await pool.query(doKanji, [hir, rom, mean, uso, url, id]);
        console.log(`Novo kanji foi criado`);

        const response = {
            message: 'kanji criado com sucesso'
        };
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

app.delete('/deleteAccount', async (req, res) => {
    const idUser = req.body.idUser;
    const directory = `public/images/${idUser}`;
    const deleteKanjis = "DELETE FROM kanjis WHERE id_user = $1;";
    const deleteUser = "DELETE FROM users WHERE id_user = $1;";
    console.log(`ID a ser deletado: ${idUser}`);

    try {
        await pool.query(deleteKanjis, [idUser]);
        console.log("Kanjis deletados");

        await pool.query(deleteUser, [idUser]);
        console.log("Usuário deletado");

        try {
            fs.accessSync(directory, constants.F_OK);
            const files = fs.readdirSync(directory);

            if (files.length !== 0) {
                for (let file of files) {
                    const filePath = path.join(directory, file);
                    fs.unlinkSync(filePath);
                }
            }

            fs.rmdirSync(directory);
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.log('sem pasta de usuário');
            } else {
                console.log(err);
            }
        }

        const response = {
            message: "Conta deletada com sucesso"
        };
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

app.delete('/removeKanji', async (req, res) => {
    console.log(req.body);
    const idKanji = req.body.idKanji;
    const deleteKanji = "DELETE FROM kanjis WHERE id_kanji = $1;";

    if (!isNaN(idKanji)) {
        try {
            await pool.query(deleteKanji, [idKanji]);
            console.log("Kanji deletado com sucesso");

            const response = {
                message: 'kanji deletado'
            };
            res.status(200).json(response);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    } else {
        const idUser = req.body.idUser
        const rom = req.body.rom
        const uso = req.body.uso
        deleteKanji = "DELETE FROM kanjis WHERE rom = $1 AND uso = $2 AND id_user = $3;"

        try {
            await pool.query(deleteKanji, [rom, uso, idUser])
            console.log("Kanji deletado com sucesso");

            const response = {
                message: 'kanji deletado'
            };
            res.status(200).json(response);
        } catch (err) {
            if (err) throw err;
        }
    }
});

app.use((req, res) => {
    res.status(404).sendFile(__dirname + '/public/404.html');
});

app.listen(port, (err) => {
    if (err) throw err;
    console.log("servidor tá rodando");
});
