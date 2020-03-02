'use strict';

(function (pitchController) {

    let data = require('../data/index.js');
    let email = require('../services/email.js');
    let auth = require('../auth/index.js');

    pitchController.init = function (app) {

        app.get('/pitch',
            auth.passport.authenticate('jwt', { session: false }),
            function (req, res) {
                let query = {};
                let limit = req.query.limit || 50;
                let page = req.query.page || 1;
                if (req.query.submitterEmail) {
                    query.submitterEmail = req.query.submitterEmail;
                }
                if (req.query.status) {
                    query.status = req.query.status;
                    if (query.status !== 'unreviewed' && query.status !== 'under_consideration' &&
                        query.status !== 'in_negotiation' && query.status !== 'accepted' && query.status !== 'rejected') {
                        res.status(400).json({
                            success: false,
                            message: 'Status invalid! Make sure its unreviewed, under_consideration, in_negotiation, accepted or rejected'
                        });
                        return;
                    }
                }

                data.getPitches(query, page, limit).then(function (results) {

                    res.json(results);

                }).catch(function (error) {
                    res.status(400).json(error);
                });

            });

        app.get('/pitch/:id',
            auth.passport.authenticate('jwt', { session: false }),
            function (req, res) {
                let id = req.params.id;

                data.findPitchById(id).then(function (result) {
                    res.json(result);
                }).catch(function (error) {
                    res.status(400).json(error);
                });
            });

        app.put('/pitch/edit_status/:id', function (req, res) {
            let status = req.body.status;
            let id = req.params.id;

            data.updatePitch({ _id: id }, status).then(function (result) {
                res.json(result);
            }).catch(function (error) {
                res.status(400).json(error);
            });
        });

        app.post('/pitch', function (req, res) {
            if (!req.body.submitterEmail || !req.body.genre || !req.body.pitchText) {
                res.status(400).json({
                    success: false,
                    message: "Fields missing"
                });
                return;
            }
            let pitch = req.body;
            let payload = email.getPayload('unreviewed', pitch);

            data.insertPitch(pitch)
                .then(function () {
                    return email.send(payload);
                })
                .then(function () {
                    res.json({
                        success: true,
                        message: 'pitch successfully created'
                    });
                })
                .catch(function (error) {
                    res.status(400).json({
                        success: false,
                        message: error.message
                    });
                });
        });

        app.get('/pitch/reject/:id',
            auth.passport.authenticate('jwt', { session: false }),
            function (req, res) {
                let id = req.params.id;

                data.updatePitch(
                    { _id: id },
                    {
                        status: 'rejected',
                        dateRejected: new Date()
                    })
                    .then(function (pitch) {
                        let payload = email.getPayload('rejected', pitch);
                        return email.send(payload);

                    }).then(function () {
                        res.json({
                            success: true,
                            message: 'pitch rejected'
                        });
                    })
                    .catch(function (error) {
                        res.status(400).json({
                            success: false,
                            message: error.message
                        });
                    });
            });

        app.get('/pitch/accept/:id',
            auth.passport.authenticate('jwt', { session: false }),
            function (req, res) {

                let id = req.params.id;

                data.updatePitch(
                        { _id: id },
                        { status: 'accepted', dateAccepted: new Date() }
                    ).then(function (pitch) {
                        let payload = email.getPayload('accepted', pitch);
                        // console.log('\n' + payload + '\n')
                        return email.send(payload);
                    }).then(function () {
                        res.json({
                            success: true,
                            message: 'pitch accepted'
                        });
                    }).catch(function (error) {
                        res.status(400).json(error);
                    });
            });

        app.put('/pitch/update/:id',
            auth.passport.authenticate('jwt', { session: false }),
            function (req, res) {
                let pitchId = req.params.id;
                let pitch = req.body;

                data.updatePitch(
                    { _id: pitchId }, pitch)
                    .then(function () {
                        res.json({
                            success: true,
                            message: 'pitch modified'
                        });
                    }).catch(function (error) {
                        res.status(400)
                            .json({
                                success: false,
                                message: error.message
                            });
                    });
            });

        app.get('/pitch/lock/:id',
            auth.passport.authenticate('jwt', { session: false }),
            function (req, res) {
                let id = req.params.id;

                data.updatePitch(
                    { _id: id },
                    { isLocked: true })
                    .then(function () {
                        res.json({
                            success: true,
                            message: 'pitch locked'
                        });
                    }).catch(function (error) {
                        res.status(400).json(error);
                    });
            });
    };

})(module.exports);