// stream으로 읽었을때 메모리를 얼마나 사용하는지 확인

const fs = require('fs')

//현재 메모리 사용량 확인
console.log('before:', process.memoryUsage().rss) // rss -프로세스가 사용 중인 메모리

//스트림 방식으로 읽기 쓰기
const readStream = fs.createReadStream('./big.txt')
const writeStream = fs.createWriteStream('./big3.txt')

readStream.pipe(writeStream) // 읽어온 big.txt 파일 내용을 big3.txt에 작성

// 읽기 스트림 완료된 후 메모리 사용량 확인
readStream.on('end', () => {
   console.log('buffer:', process.memoryUsage().rss) //메모리 사용량 54MB만 사용
})
