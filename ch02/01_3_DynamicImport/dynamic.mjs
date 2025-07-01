const a = true

/*
ES모듈은 특정 조건절에 사용 X
if (a) {
   import './func.mjs'
}
*/

// ES모듈을 특정 조건절에서 사용가능
if (a) {
   await import('./func.mjs')
}

console.log('성공')
