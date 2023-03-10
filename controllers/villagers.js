const express = require('express')
require('dotenv').config()
const axios = require('axios')
const db = require('../models')
const router = express.Router()

// GET /villagers show all the villagers
router.get('/', async (req, res) => {
    try {
        let acnhUrl = process.env.API
        const response = await axios.get(acnhUrl)
        // console.log(response.data[0].personality)
        res.render('villagers/all.ejs', {
            villagers: response.data,
        })
    } catch (error) {
        console.log('cannot get info', error)
    }
})

// GET /:id show detail of a villager
router.get('/:id', async (req, res) => {
    try {
        let acnhUrl = process.env.API + '/' + req.params.id
        const response = await axios.get(acnhUrl)
        const getComment = await db.comment.findAll({
            where: { villagerId: req.params.id, 
            }
        })
        // console.log(acnhUrl)
        // console.log(response.data)
        // console.log(getComment)
        res.render('villagers/details.ejs', {
            villagers: response.data,
            users: res.locals.user,
            comments: getComment,
        })
    } catch (error) {
        console.log('cannot get info', error)
    }
})

// POST /:id add comment
router.post('/:id', async (req, res) => {
    try {
        const createComment = await db.comment.create({
            userId: req.body.userId,
            villagerId: req.body.villagerId,
            comment: req.body.comment
        })
        res.redirect(`/villagers/${req.params.id}`)
    } catch (error) {
        console.log('cannot get info', error)
    }
})
// ___________________LAST STRETCH_________________
// GET /:id load edit comment
router.get('/:id/edit', async (req, res) => {
    try {
        const findComment = await db.comment.findByPk(req.params.id)
        res.render('villagers/edit.ejs', {
            comment: findComment
        })
        // console.log(findComment)
    } catch (error) {
        console.log('cannot get info', error)
    }
})

router.put('/:id/edit', async (req, res) => {
    try {
        const editComment = await db.comment.findByPk(req.params.id)
        await editComment.update({
            comment: req.body.comment
        })
        res.redirect(`/villagers/${editComment.villagerId}`)
    } catch (error) {
        console.log('cannot get info', error)
    }
})

// DELETE /:id delete comment
router.delete('/:id', async (req, res) => {
    try {
        const deleteComment = await db.comment.findByPk(req.params.id)
        deleteComment.destroy()
        res.redirect(`/villagers/${deleteComment.villagerId}`)
    } catch (error) {
        console.log('cannot get info', error)
    }
})

// router export
module.exports = router;