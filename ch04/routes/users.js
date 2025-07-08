const express = require('express')
const User = require('../models/user')
const Comment = require('../models/comment')

const router = express.Router()

// 모든 사용자
// localhost:8000/users
router.get('/', async (req, res, next) => {
   try {
      // select * from users
      const users = await User.findAll()
      console.log('users:', users)

      // 200: 성공
      // json 형태로 response
      res.status(200).json(users)
   } catch (error) {
      console.error(error)
      next(error) // 에러처리 미들웨어로 이동
   }
})

// 특정 사용자
// localhost:8000/users/2
router.get('/:id', async (req, res, next) => {
   try {
      // select * from users where id = 2
      const user = await User.findAll({
         where: { id: req.params.id },
      })
      console.log(user)
      res.status(200).json(user)
   } catch (error) {
      console.error(error)
      next(error)
   }
})

// post 요청: 사용자 등록
// localhost:8000/
router.post('/', async (req, res, next) => {
   try {
      console.log('req.body', req.body)
      const user = await User.create({
         name: req.body.name, //클라이언트에서 받은 값들을 컬럼값으로 지정
         age: req.body.age,
         married: req.body.married,
         comment: req.body.comment,
      })
      console.log(user) //생성된 사용자 데이터 출력
      res.status(201).json(user) //상태코드 201과 함께 json객체 형태로 생성된 사용자 전달
   } catch (err) {
      console.error(err)
      next(err) // 에러를 에러 미들웨어로 전달
   }
})

// 특정 사용자의 댓글 모두 가져오기
//localhost:8000/users/:id/comments
router.get('/:id/comments', async (req, res, next) => {
   try {
      const comments = await Comment.findAll({
         include: {
            model: User,
            where: { id: req.params.id },
         },
      })
      /*
       select comments.*, users.* 
       from comments
       join user 
       on comments.commenter = users.id
       where users.id = :id
      */
      console.log(comments)
      res.status(200).json(comments)
   } catch (error) {
      console.error(error)
      next(error)
   }
})

module.exports = router
