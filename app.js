const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')

const urlencoderParser = bodyParser.urlencoded({ extended: false })

const {User} = require('./models')

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
    //fetch
    //then
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

// inscription:
app.get('/singup', (req, res) =>{
    res.render('singup.pug')
})

app.post('/singup', urlencoderParser, (req, res) =>{
    console.log("signup",req.body)
    res.render('singup.pug')
})

// connexion:
app.get('/singin', (req, res) =>{
    res.render('singin.pug')
});

app.post('/singin', urlencoderParser, (req, res) =>{
    console.log("singin", req.body)
    res.render('singin.pug')
})

//admin
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