const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')

const urlencoderParser = bodyParser.urlencoded({ extended: false })

const User = require('./models')

const app = express()
app.use(helmet())
app.use(express.static('public'))

app.set('view engine', './views')

const port = 3000

app.get('/', (req, res)=>{
    res.render('index.pug')
})


//Récuperer tous les utilisateurs
app.get('/admin', async (req, res)=>{
    //promesse
    //
    //
    try{
        const users = await User.findAll()
        console.log('users->', users)
        res.render('admin.pug')
    }catch (error) {
        console.log('error dans le user findAll()',error)
        //renvoyer error 500
        //res.render
    }
})

app.get('/singup', (req, res) =>{
    res.render('singup.pug')
})
app.post('/singup', urlencoderParser, (req, res) =>{
    console.log("POST/singup -> req.body.email:", req.body.email)
    console.log("POST/singup -> req.body.password:", req.body.password)
    res.render('singup.pug')
})
app.get('/singin',urlencoderParser, (req, res) =>{
    res.render('singin.pug')
})
app.post('/singin', (req, res) =>{
    console.log("POST/singin -> req.body.email:", req.body.email)
    console.log("POST/singin -> req.body.password:", req.body.password)
    res.render('singin.pug')
})

app.get('/admin', (req, res) => {
    res.render('admin.pug')
})
app.get('/chat', (req, res) => {
    res.render('chat.pug')
})


app.get('*', (req, res)=> {
    res.status(404).render('404.pug')
})

app.listen(port, () =>
    console.log(`le serveur est lancé dans le port ${port}`)
)