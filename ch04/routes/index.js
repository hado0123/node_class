const express = require('express')
const User = require('../models/user')

const router = express.Router()

// localhost:8000/
router.get('/', async (req, res, next) => {
   try {
      // select * from users
      const users = await User.findAll()

      // 200: 성공
      // json 형태로 response
      res.status(200).json(users)
   } catch (error) {
      console.error(error)
      next(error) // 에러처리 미들웨어로 이동
   }
})

module.exports = router
