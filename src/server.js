const express = require("express") // Essa função faz o pedido do express e retorna na variavél
const server = express() // Executa a função express na variavel "server"

// Pegar o banco de dados
const db = require("./database/db.js")

// Configurar pasta publica
server.use(express.static("public"))

// Hbilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({ extends: true }))


// Utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

// Configurar caminhos da minha aplicação
// Página inicial
// req: Requisição
// res: Resposta
server.get("/", (req, res) => {
    return res.render("index.html")
})

server.get("/create-point", (req, res) => {

    // re.query: Query Strings da nossa url
    console.log(req.query)

    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {

    // req.body: O corpo da nossa url
    //console.log(req.body)

    // Inserir dados no banco de dados
    const query = `
    INSERT INTO places (
        image,
        name,
        address,
        address2,
        state,
        city,
        items
    ) VALUES (?,?,?,?,?,?,?)

`

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if(err) {
            console.log(err)
            return res.render("create-point.html", {errocad: true})
        }

        return res.render("create-point.html", { saved: true })

    }
        
    db.run(query, values, afterInsertData)

})

server.get("/search", (req, res) => {

    const search = req.query.search

    if(search == "") {
        // Pesquisa vazia
        return res.render("search-results.html", { total: 0 })

    }

    // Pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if(err) {
            return console.log(err)
        }

        const total = rows.length

        // Mostrar a página HTML com os dados do banco de dados
        return res.render("search-results.html", { places: rows, total: total })

    })
})

// Ligar o servidor
server.listen(3000)