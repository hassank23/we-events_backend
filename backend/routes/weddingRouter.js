const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Weddings = require('../models/bookWedding');

const weddingRouter = express.Router();

weddingRouter.use(bodyParser.json());

weddingRouter.route('/')
    .get((req, res, next) => {
        Weddings.find({})
            .then((weddings) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(weddings);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Weddings.create(req.body)
            .then((wedding) => {
                console.log('wedding Created ', wedding);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(wedding);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /bookWedding');
    })
    .delete((req, res, next) => {
        Weddings.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

weddingRouter.route('/:weddingId')
    .get((req, res, next) => {
        Weddings.findById(req.params.weddingId)
            .then((wedding) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(wedding);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /bookWedding/' + req.params.weddingId);
    })
    .put((req, res, next) => {
        Weddings.findByIdAndUpdate(req.params.weddingId, {
                $set: req.body
            }, { new: true })
            .then((wedding) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(wedding);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Weddings.findByIdAndRemove(req.params.weddingId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });
/////////food
weddingRouter.route('/:weddingId/food')
    .get((req, res, next) => {
        Weddings.findById(req.params.weddingId)
            .then((wedding) => {
                if (wedding != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(wedding.food);
                } else {
                    err = new Error('Wedding ' + req.params.weddingId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Weddings.findById(req.params.weddingId)
            .then((wedding) => {
                if (wedding != null) {
                    wedding.food.push(req.body);
                    wedding.save()
                        .then((wedding) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(wedding);
                        }, (err) => next(err));
                } else {
                    err = new Error('wedding ' + req.params.weddingId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /weddings/' +
            req.params.weddingId + '/food');
    })
    .delete((req, res, next) => {
        Weddings.findById(req.params.weddingId)
            .then((wedding) => {
                if (wedding != null) {
                    for (var i = (wedding.food.length - 1); i >= 0; i--) {
                        wedding.food.id(wedding.food[i]._id).remove();
                    }
                    wedding.save()
                        .then((wedding) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(wedding);
                        }, (err) => next(err));
                } else {
                    err = new Error('Wedding ' + req.params.weddingId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

weddingRouter.route('/:weddingId/food/:foodId')
    .get((req, res, next) => {
        Weddings.findById(req.params.weddingId)
            .then((wedding) => {
                if (wedding != null && wedding.food.id(req.params.foodId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(wedding.food.id(req.params.foodId));
                } else if (wedding == null) {
                    err = new Error('Wedding' + req.params.weddingId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('Food' + req.params.foodId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /weddings/' + req.params.weddingId +
            '/food/' + req.params.foodId);
    })
    .put((req, res, next) => {
        Weddings.findById(req.params.weddingId)
            .then((wedding) => {
                if (wedding != null && wedding.food.id(req.params.foodId) != null) {
                    if (req.body.food_type) {
                        wedding.food.id(req.params.foodId).food_type = req.body.food_type
                    }
                    if (req.body.drink_type) {
                        wedding.food.id(req.params.foodId).drink_type = req.body.drink_type
                    }
                    if (req.body.food) {
                        wedding.food.id(req.params.foodId).request_food = req.body.request_food;
                    }
                    wedding.save()
                        .then((wedding) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(wedding);
                        }, (err) => next(err));
                } else if (wedding == null) {
                    err = new Error('Wedding ' + req.params.weddingId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('food ' + req.params.foodId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Weddings.findById(req.params.weddingId)
            .then((wedding) => {
                if (wedding != null && wedding.food.id(req.params.foodId) != null) {
                    wedding.food.id(req.params.foodId).remove();
                    wedding.save()
                        .then((wedding) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(wedding);
                        }, (err) => next(err));
                } else if (wedding == null) {
                    err = new Error('wedding ' + req.params.weddingId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('food ' + req.params.foodId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });


//////music
weddingRouter.route('/:weddingId/music')
    .get((req, res, next) => {
        Weddings.findById(req.params.weddingId)
            .then((wedding) => {
                if (wedding != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(wedding.music);
                } else {
                    err = new Error('wedding ' + req.params.weddingId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Weddings.findById(req.params.weddingId)
            .then((wedding) => {
                if (wedding != null) {
                    wedding.music.push(req.body);
                    wedding.save()
                        .then((wedding) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(wedding);
                        }, (err) => next(err));
                } else {
                    err = new Error('wedding ' + req.params.weddingId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /Weddings/' +
            req.params.weddingId + '/music');
    })
    .delete((req, res, next) => {
        Weddings.findById(req.params.weddingId)
            .then((wedding) => {
                if (wedding != null) {
                    for (var i = (wedding.music.length - 1); i >= 0; i--) {
                        wedding.music.id(wedding.music[i]._id).remove();
                    }
                    wedding.save()
                        .then((wedding) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(wedding);
                        }, (err) => next(err));
                } else {
                    err = new Error('wedding ' + req.params.weddingId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

weddingRouter.route('/:weddingId/music/:musicId')
    .get((req, res, next) => {
        Weddings.findById(req.params.weddingId)
            .then((wedding) => {
                if (wedding != null && wedding.music.id(req.params.musicId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(wedding.music.id(req.params.musicId));
                } else if (wedding == null) {
                    err = new Error('wedding ' + req.params.weddingId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('music ' + req.params.musicId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /Weddings/' + req.params.weddingId +
            '/music/' + req.params.musicId);
    })
    .put((req, res, next) => {
        Weddings.findById(req.params.weddingId)
            .then((wedding) => {
                if (wedding != null && wedding.music.id(req.params.musicId) != null) {
                    if (req.body.music) {
                        wedding.music.id(req.params.musicId).music = req.body.music;
                    }
                    if (req.body.singer) {
                        wedding.music.id(req.params.musicId).singer = req.body.singer;
                    }
                    if (req.body.request_music) {
                        wedding.music.id(req.params.musicId).request_music = req.body.request_music;
                    }
                    wedding.save()
                        .then((wedding) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(wedding);
                        }, (err) => next(err));
                } else if (wedding == null) {
                    err = new Error('wedding ' + req.params.weddingId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('music' + req.params.musicId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Weddings.findById(req.params.weddingId)
            .then((wedding) => {
                if (wedding != null && wedding.music.id(req.params.musicId) != null) {
                    wedding.music.id(req.params.musicId).remove();
                    wedding.save()
                        .then((wedding) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(wedding);
                        }, (err) => next(err));
                } else if (wedding == null) {
                    err = new Error('wedding ' + req.params.weddingId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('music ' + req.params.musicId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });


///////photography
weddingRouter.route('/:weddingId/photography')
    .get((req, res, next) => {
        Weddings.findById(req.params.weddingId)
            .then((wedding) => {
                if (wedding != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(wedding.photography);
                } else {
                    err = new Error('wedding ' + req.params.weddingId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Weddings.findById(req.params.weddingId)
            .then((wedding) => {
                if (wedding != null) {
                    wedding.photography.push(req.body);
                    wedding.save()
                        .then((wedding) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(wedding);
                        }, (err) => next(err));
                } else {
                    err = new Error('wedding ' + req.params.weddingId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /Weddings/' +
            req.params.weddingId + '/photography');
    })
    .delete((req, res, next) => {
        Weddings.findById(req.params.weddingId)
            .then((wedding) => {
                if (wedding != null) {
                    for (var i = (wedding.photography.length - 1); i >= 0; i--) {
                        wedding.photography.id(wedding.photography[i]._id).remove();
                    }
                    wedding.save()
                        .then((wedding) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(wedding);
                        }, (err) => next(err));
                } else {
                    err = new Error('wedding ' + req.params.weddingId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

weddingRouter.route('/:weddingId/photography/:photography')
    .get((req, res, next) => {
        Weddings.findById(req.params.weddingId)
            .then((wedding) => {
                if (wedding != null && wedding.photography.id(req.params.photography) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(wedding.photography.id(req.params.photography));
                } else if (wedding == null) {
                    err = new Error('wedding ' + req.params.weddingId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('photography' + req.params.photography + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /Weddings/' + req.params.weddingId +
            '/photography/' + req.params.photography);
    })
    .put((req, res, next) => {
        Weddings.findById(req.params.weddingId)
            .then((wedding) => {
                if (wedding != null && wedding.photography.id(req.params.photography) != null) {
                    if (req.body.location) {
                        wedding.photography.id(req.params.photography).location = req.body.location;
                    }
                    if (req.body.numberOfPhotos) {
                        wedding.photography.id(req.params.photography).numberOfPhotos = req.body.numberOfPhotos;
                    }
                    if (req.body.datePhoto) {
                        wedding.photography.id(req.params.photography).datePhoto = req.body.datePhoto;
                    }
                    if (req.body.agree) {
                        wedding.photography.id(req.params.photography).agree = req.body.agree;
                    }
                    if (req.body.request_photo) {
                        wedding.photography.id(req.params.photography).request_photo = req.body.request_photo;
                    }
                    wedding.save()
                        .then((wedding) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(wedding);
                        }, (err) => next(err));
                } else if (wedding == null) {
                    err = new Error('wedding ' + req.params.weddingId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('photography' + req.params.photography + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Weddings.findById(req.params.weddingId)
            .then((wedding) => {
                if (wedding != null && wedding.photography.id(req.params.photography) != null) {
                    wedding.photography.id(req.params.photography).remove();
                    wedding.save()
                        .then((wedding) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(wedding);
                        }, (err) => next(err));
                } else if (wedding == null) {
                    err = new Error('wedding ' + req.params.weddingId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('photography' + req.params.photography + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

///avenue

weddingRouter.route('/:weddingId/avenue')
    .get((req, res, next) => {
        Weddings.findById(req.params.weddingId)
            .then((wedding) => {
                if (wedding != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(wedding.avenue);
                } else {
                    err = new Error('wedding ' + req.params.weddingId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Weddings.findById(req.params.weddingId)
            .then((wedding) => {
                if (wedding != null) {
                    wedding.avenue.push(req.body);
                    wedding.save()
                        .then((wedding) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(wedding);
                        }, (err) => next(err));
                } else {
                    err = new Error('wedding ' + req.params.weddingId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /Weddings/' +
            req.params.weddingId + '/avenue');
    })
    .delete((req, res, next) => {
        Weddings.findById(req.params.weddingId)
            .then((wedding) => {
                if (wedding != null) {
                    for (var i = (wedding.avenue.length - 1); i >= 0; i--) {
                        wedding.avenue.id(wedding.avenue[i]._id).remove();
                    }
                    wedding.save()
                        .then((wedding) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(wedding);
                        }, (err) => next(err));
                } else {
                    err = new Error('wedding ' + req.params.weddingId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

weddingRouter.route('/:weddingId/avenue/:avenueId')
    .get((req, res, next) => {
        Weddings.findById(req.params.weddingId)
            .then((wedding) => {
                if (wedding != null && wedding.avenue.id(req.params.avenueId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(wedding.avenue.id(req.params.avenueId));
                } else if (wedding == null) {
                    err = new Error('wedding ' + req.params.weddingId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('avenue ' + req.params.avenueId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /Weddings/' + req.params.weddingId +
            '/avenue/' + req.params.avenueId);
    })
    .put((req, res, next) => {
        Weddings.findById(req.params.weddingId)
            .then((wedding) => {
                if (wedding != null && wedding.avenue.id(req.params.avenueId) != null) {


                    if (req.body.avenue) {
                        wedding.avenue.id(req.params.avenueId).avenue = req.body.avenue;
                    }
                    wedding.save()
                        .then((wedding) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(wedding);
                        }, (err) => next(err));
                } else if (wedding == null) {
                    err = new Error('wedding ' + req.params.weddingId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('avenue ' + req.params.avenueId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Weddings.findById(req.params.weddingId)
            .then((wedding) => {
                if (wedding != null && wedding.avenue.id(req.params.avenueId) != null) {
                    wedding.avenue.id(req.params.avenueId).remove();
                    wedding.save()
                        .then((wedding) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(wedding);
                        }, (err) => next(err));
                } else if (wedding == null) {
                    err = new Error('wedding ' + req.params.weddingId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('avenue ' + req.params.avenueId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });


module.exports = weddingRouter;