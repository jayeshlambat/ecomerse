import express from 'express'
import{  userRegistration,  userLogin } from '../controller/user.controller.js'

const routes = express.Router()
routes.post('/signup', userRegistration)
routes.post('/signin', userLogin)

export default routes
