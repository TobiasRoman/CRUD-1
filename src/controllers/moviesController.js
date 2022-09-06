const db = require('../database/models');
const sequelize = db.sequelize;

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => { /* también las propiedades del objeto se pueden poner como string */
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        res.render('moviesAdd')  
    },
    create: function (req, res) {
        /* destructuración del body */
        const { title, rating, release_date, length, awards } = req.body
        db.Movie.create({
            title,  /* puede que el nombre de la columna no sea la misma que el nombre del imput */
            rating,
            release_date,
            length,
            awards
        }).then(movie => {
            res.redirect('/movies')
        })
        .catch((error) => {
            res.send(error) /* lo manejamos simple, pero podemos enviar un email con los errores */
        })
    },
    edit: function (req, res) {
        db.Movie.findByPk(req.params.id)
        .then((movie) => {
            res.render('moviesEdit', {
                movie
            })
        })
        .catch((error) => {
            res.send(error)  
        })
    },
    update: function (req, res) {

        const {title, rating, release_date, length, awards} = req.body

        db.Movie.update({ 
            title, /* esto es lo que pasaremos como dato para que lo reemplace */
            rating,
            release_date,
            length,
            awards
        }, {
                where: {
                    id: req.params.id
                }
            })
            .then((result) => {
                if(result){
                    res.redirect('/movies')
                }
            })
            .catch((error) => {
                res.send(error)  
            })
    }, 
    delete: function (req, res) { 
        db.Movie.findByPk(req.params.id)
        .then((movie) => {
            res.render('moviesDelete', {
                movie
            })
        })
    },
    destroy: function (req, res) { 
        db.Movie.destroy({
            where: {
                id: req.params.id
            }
        })
        .then((result) => {
            console.log(result)
            res.redirect('/movies')
        })
    }

}

/* A la hora de borrar, no podré borrar todas porque algunas estarán enlazadas por una tabla pivot */

module.exports = moviesController;