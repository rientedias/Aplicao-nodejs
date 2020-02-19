/*
 * CONFIGURAÇÃO
 * Configurando o servidor.
 * Configuração de arquivos staticos.
 * Habilitando body do formulario.
 */

const express = require('express');
const server = express();

server.use(express.static('public'));//acesso os arquivos style.css, script.js, logo.png

server.use(express.urlencoded({ extended: true }));

/**
 * CONECXÃO
 * Configurando a conexão com o banco de dados.
 */

const Pool = require('pg').Pool;

const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5432,
    database: 'doe'
});

/*
 * TEMPLATE
 * Configurando template engine.
 */

const nunjucks = require('nunjucks');

nunjucks.configure("./", {
    express: server,
    noCache: true, //limpando o cache.
});

/*
 * PAGINA
 * Configuração da pagina.
 * Get.
 * Post.
 */

server.get('/', function (req, res) {

    db.query("SELECT * FROM donors", function (err, result) {

        if (err) return res.send('Erro de banco de dados.');

        const donors = result.rows;

        return res.render("index.html", { donors });

    });

});

server.post('/', function (req, res) {

    //Pegando os valores do input
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {

        return res.send("todos os campos são obrigatorios.");

    }

    //Colocando valores no banco de dados.
    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES($1, $2, $3)`

    const values = [name, email, blood];//Array de variaveis.

    db.query(query, values, function (err) {

        //tratamento de erro.
        if (err) return res.send("Erro no banco de dados.");

        return res.redirect("/"); // Redirecionando para a pagina.

    });

});

/*
 * SERVIDOR
 * Ligar o servidor e permitir o acesso a porta 3000
 */

server.listen(3000, function () {
    console.log("Servidor iniciado.");
});

