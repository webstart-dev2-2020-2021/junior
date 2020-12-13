const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cons = require('consolidate')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const urlencoderParser = bodyParser.urlencoded({ extended: false })
const {User} = require('./models')
const {Op} = require('sequelize')
const {emailRegex} = require('./helpers/regex')
const {usernameRegex} = require('./helpers/regex')
const {passwordRegex} = require('./helpers/regex')
const app = express()

app.use(helmet())
app.use(express.static('public'))
app.set('view engine', './views')
//ajouté par moi;
app.use(cookieParser('secret'))
app.use(session({cookie: {max: null}}))// a commenter

app.use(
    session({
        secret: 'unephrasetrèstrèssecrète',
        resave: false,
        saveUninitialized: false
    })
)

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done)=>{
    done(null, user)
})

passport.deserializeUser((user, done)=>{
    done(null, user)
})

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({
                where: { username },
            })
            if (!user || (user.password !== password)) {
                return done(null, false, {
                    success: false,
                    message: 'Mauvais identifiants',
                })
            }
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    })
)


//pour les alerts danger, succes...
app.use((req, res, next)=>{
    res.locals.message = req.session.message
    delete req.session.message
    next()
})

const port = 3000

app.get('/', (req, res)=>{
    res.render('index.pug', { username: 'junior' })
})


//Récuperer tous les utilisateurs
app.get('/admin', async (req, res) => {
    //promesse
    //fetch
    //then
    try{
/*        if (!req.user.isAdmin){
            req.session.message = {
                notadmin : 'danger',
                noadmin : 'vous êtes pas un admin!'
            }
            res.redirect('/')
        }
*/
        const users = await User.findAll()
        console.log('users ->', users)
        res.status(200).render('admin.pug', { users })
    }catch (error) {
        console.log('error dans le user findAll() ->',error)
        //renvoyer error 500
        //res.render
        res.status(500).render('500.pug')
    }
})

// inscription:
app.get('/singup', (req, res) =>{
    res.render('singup.pug')
})

app.post('/singup', urlencoderParser, async (req, res) => {
    try{

        console.log("singup",req.body)
        const { email, password, username } = req.body

        //si le champs est vide!
        if(req.body.username == '' || req.body.email=='' || req.body.password==''){
            req.session.message = {
                type : 'danger',
                message : 'Merci de bien vouloir remplir tous les champs vides avant de vous inscrire!'
            }
            res.redirect('/singup')
        }
        else if(!email.match(emailRegex)){
            req.session.message = {
                emailtype : 'danger',
                mail : 'Example:junior@psg.com',
            }
            res.redirect('/singup')

        }
        else if(!username.match(usernameRegex)){
            req.session.message = {
                usernametype : 'danger',
                username : 'Example: user.junior',
            }
            res.redirect('/singup')

        }

        else if(!password.match(passwordRegex)){
            req.session.message = {
                pwtype : 'danger',
                password : 'Example: "abCD1234", Entrez des chiffres, lettres en majuscules et minuscules',
            }
            res.redirect('/singup')

        }
        else{
            req.session.message = {
                type : 'success',
                message : 'Bienvenue, vous êtes bien inscrit!'
            }
            res.redirect('/singup')

        }
        //enregistrer un nouvel utilisateur
        const [user, created] = await User.findOrCreate({
            where: {[Op.or]: [{username}, {email}] },
            defaults: {
                username,
                email,
                password,
                isAdmin: true
            }
        })
        if(!created){
            //avertir l'user: email et usernane deja utilisé!
            req.session.message = {
                createdtype : 'danger',
                created : 'email exite déjà',
            }
            res.redirect('/singup')

        }

        console.log('erreur dans POST/signup -> utilisateur crée', user)
        res.status(200).render('singup.pug')
    } catch (error) {
        console.log('erreur dans POST/singnup ->', error)
        res.status(500).render('500.pug')
    }
})

// connexion:
app.get('/singin', (req, res) =>{
    res.status(200).render('singin.pug')
})

app.post(
    '/singin',
    urlencoderParser,
    passport.authenticate('local',
        {
        successRedirect: '/singin',
        failureRedirect: '/chat',
    })
)

app.get('/signout', (req, res) =>{
    req.logout()
    res.redirect('/singin')
})

//admin
app.get('/admin', (req, res) => {
    res.render('admin.pug')
})

app.get('/chat', (req, res) => {
    res.status(200).render('chat.pug')
})

app.get('*', (req, res) => {
    res.status(404).render('404.pug')
})

app.listen(port, () =>
    console.log(`le serveur est lancé dans le port ${port}`)
)