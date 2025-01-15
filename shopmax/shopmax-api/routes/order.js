const express = require('express')
const router = express.Router()
const { sequelize } = require('../models')
const { Order, Item, User, OrderItem, Img } = require('../models')
const { isLoggedIn } = require('./middlewares')
const { Op } = require('sequelize')

// 주문
router.post('/', isLoggedIn, async (req, res) => {
   /* ★트랜잭션 처리: 주문 처리 중 에러 발생시 차감된 재고를 복구하지 않으면 데이터가 
     불일치 상태가 되므로 트랜잭션 처리 
 
      <아래 3가지가 쪼갤 수 없는 업무 단위인 트랜잭션으로 묶임, 3가지 중 하나에서 문제 발생시 3가지 모두 취소됨>
      -Order 테이블에 주문내역 insert
      -Item 테이블에서 재고 차감
      -OrdertItem 테이블에 주문상품 insert
     */
   const transaction = await sequelize.transaction() // 하나의 트랜잭션

   try {
      // items: {[{itemId: 1, count: 2 }, {itemId: 2, count: 1 }]}
      const { items } = req.body

      // 회원 확인(주문은 회원만 가능)
      const user = await User.findByPk(req.user.id)
      if (!user) {
         throw new Error('회원이 존재하지 않습니다.')
      }

      // Order 테이블에 주문내역 insert
      const order = await Order.create(
         {
            userId: user.id,
            orderDate: new Date(),
            orderStatus: 'ORDER',
         },
         { transaction } // 하나의 트랜잭션으로 묶을 작업에만 { transaction } 작성
      )

      // Item 테이블에서 재고 차감

      let totalOrderPrice = 0 // 총 주문 상품 가격

      /*
       Promise.all(...): 비동기 작업들을 병렬실행(여러작업을 동시 실행)을 통해 성능을 최적화 한다.
       
       

       for(const item of items) {
           const product = await Item.findByPk(item.itemId, { transaction })
           ...
           ...
       }
      */
      const orderItemsData = await Promise.all(
         items.map(async (item) => {
            //1. 상품이 있는지 확인
            const product = await Item.findByPk(item.itemId, { transaction })

            //2. 재고 차감

            //3. 재고 차감 후 item 테이블에 update
         })
      )

      // OrdertItem 테이블에 주문상품 insert
   } catch (error) {
      await transaction.rollback() // 트랜잭션 롤백

      console.error(error)
      res.status(500).json({ success: false, message: '주문 중 오류가 발생했습니다.', error })
   }
})

module.exports = router
