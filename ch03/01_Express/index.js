const express = require('express')
require('dotenv').config() // env파일을 사용하기위한 라이브러리 로드

const app = express()
app.set('port', process.env.PORT || 3000) //서버에 포트 지정(env파일에 PORT값이 없으면 3000번 포트 실행)

/*
app.get() -> read 요청
app.post() -> create 요청
app.delete() -> 삭제 요청
app.put() -> 전체 수정 요청
app.patch() -> 일부 수정 요청
*/

// http://localhost:8000/ 로 get request(데이터를 줘)가 온 경우 실행
app.get('/', (req, res) => {
   // request가 들어오면 콜백함수 부분의 코드를 실행한다
   // req: 요청에 대한 정보가 들어있는 객체
   // res: 응답을 처리하는 객체
   res.send('안녕! node express!') // 클라이언트에게 응답을 보낸다
})

// http://localhost:8000/ 로 post request(데이터를 생성해줘)가 온 경우 실행
// app.post('/', (req, res) => {
//    res.send('안녕! node express!')
// })

// http://localhost:8000/test 로 request가 온 경우 실행
app.get('/test', (req, res) => {
   res.send('안녕! test!')
})
//서버를 동작시킴
app.listen(app.get('port'), () => {
   console.log(`서버가 작동 중 입니다. http://localhost:${app.get('port')}`)
})
