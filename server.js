const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');

var maintenance = false;

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log)
    fs.appendFileSync('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to log');
        }
    });
    next();
});

app.use((req, res, next) => {
    if (maintenance) {
        res.render('maintenance.hbs')
    } else {
        next();
    }
})

app.use(express.static(__dirname + '/public'))

hbs.registerHelper('getCurrentYear', () => new Date().getFullYear())
hbs.registerHelper('screamIt', (text) => text.toUpperCase())

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to the website'
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

app.get('/bad', (req, res) => {
    res.json({
        errorMessage: 'Error handling request'
    });
});

app.listen(process.env.port || process.env.PORT || 3000, () => console.log("Server up"))