import React, { useState, useCallback } from 'react'
import { TextField, Button, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import { formatWithComma, stripComma } from '../../utils/priceSet'

function ItemEditForm({ onEditSubmit, initialValues = {} }) {
   // 이미지가 여러개 이므로 배열로 다룬다
   /*
    [
      'http://localhost:8000/ap_31736383153088.png',
      'http://localhost:8000/model_11736383153094.png',
      'http://localhost:8000/model_61736383153113.png',
    ]
   */
   const [imgUrls, setImgUrls] = useState(initialValues.Imgs.map((img) => import.meta.env.VITE_APP_API_URL + img.imgUrl)) // 이미지 경로
   const [imgFiles, setImgFiles] = useState([]) // 이미지 파일 객체
   const [itemNm, setItemNm] = useState(initialValues.itemNm) // 상품명
   const [price, setPrice] = useState(String(initialValues.price)) // 가격
   const [stockNumber, setStockNumber] = useState(initialValues.stockNumber) // 재고
   const [itemSellStatus, setItemSellStatus] = useState(initialValues.itemSellStatus) // 판매상태
   const [itemDetail, setItemDetail] = useState(initialValues.itemDetail) // 상품설명

   // 이미지 파일 변경(이미지 미리보기, 이미지 파일 객체를 imgFiles에 저장)
   const handleImageChange = useCallback((e) => {
      const files = e.target.files // 업로드된 모든 파일 객체 가져오기
      if (!files || files.length === 0) return // 파일이 없거나 길이가 0이면 함수 종료

      // 업로드된 파일 객체를 배열로 바꾸고 최대 5개 까지만 선택
      const newFiles = Array.from(files).slice(0, 5)
      // console.log(newFiles)

      // 선택된 새 파일로 이미지 객체 상태 업데이트
      // newFiles = [File, File, File]
      setImgFiles(newFiles)

      // 미리보기
      const newImgUrls = newFiles.map((file) => {
         const reader = new FileReader()
         reader.readAsDataURL(file) // 파일 데이터 읽기

         //promise 객체를 리턴하여 비동기적으로 FileReader 작업(속도가 빠름)
         return new Promise((resolve) => {
            // 파일 읽기가 완료 되었을 때 결과를 promise에 전달
            // event.target.result: 인코딩 된 이미지 미리보기 url이 들어있음
            reader.onload = (event) => resolve(event.target.result)
         })
      })

      // 모든 파일의 데이터 URL을 생성 완료한 후 실행
      Promise.all(newImgUrls).then((urls) => {
         // console.log(urls)
         // 생성된 새 미리보기 URL로 상태 업데이트
         setImgUrls(urls)
      })
   }, [])

   // 상품 등록
   const handleSubmit = useCallback(
      (e) => {
         e.preventDefault()

         if (!itemNm.trim()) {
            alert('상품명을 입력하세요.')
            return
         }

         if (!String(price).trim()) {
            alert('가격을 입력하세요.')
            return
         }

         if (!String(stockNumber).trim()) {
            alert('재고를 입력하세요.')
            return
         }

         if (!itemDetail.trim()) {
            alert('상품설명을 입력하세요.')
            return
         }

         //  if (imgFiles.length === 0) {
         //     alert('이미지를 최소 1개 이상 업로드하세요.')
         //     return
         //  }

         const formData = new FormData()
         formData.append('itemNm', itemNm)
         formData.append('price', price)
         formData.append('stockNumber', stockNumber)
         formData.append('itemSellStatus', itemSellStatus)
         formData.append('itemDetail', itemDetail)

         // 이미지 파일 여러개 인코딩 처리(한글 파일명 깨짐 방지) 및 추가
         imgFiles.forEach((file) => {
            const encodedFile = new File([file], encodeURIComponent(file.name), { type: file.type })
            formData.append('img', encodedFile)
         })

         onEditSubmit(formData)
      },
      [itemNm, price, stockNumber, itemSellStatus, itemDetail, imgFiles, onEditSubmit, imgUrls]
   )

   // 가격에서 콤마 제거
   const handlePriceChange = useCallback((e) => {
      const rawValue = e.target.value // 입력된 가격 10,000
      const numericValue = stripComma(rawValue) // 콤마 제거

      // 숫자가 아닌 값이 입력되면 리턴
      const isNumric = /^\d*$/
      if (!isNumric.test(numericValue)) return

      // price 컬럼의 타입은 int(정수형)이므로 콤마가 붙은 값을 insert 할수 없다. 따라서 price state의 값은 콤마를 제거해 저장한다.
      setPrice(numericValue)
   }, [])

   // 재고입력시 숫자만 입력하도록
   const handleStockChange = useCallback((e) => {
      const rawValue = e.target.value

      // 숫자가 아닌 값이 입력되면 리턴
      const isNumric = /^\d*$/
      if (!isNumric.test(rawValue)) return

      setStockNumber(rawValue)
   }, [])

   return (
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }} encType="multipart/form-data">
         {/* 이미지 업로드 필드 */}
         <Button variant="contained" component="label">
            이미지 업로드 (최대 5개)
            <input type="file" name="img" accept="image/*" hidden multiple onChange={handleImageChange} />
         </Button>

         {/* 업로드된 이미지 미리보기 */}
         <Box
            display="flex"
            flexWrap="wrap"
            gap={2}
            mt={2}
            sx={{
               justifyContent: 'flex-start',
            }}
         >
            {imgUrls.map((url, index) => (
               <Box
                  key={index}
                  sx={{
                     width: '120px',
                     height: '120px',
                     border: '1px solid #ccc',
                     borderRadius: '8px',
                     overflow: 'hidden',
                     display: 'flex',
                     justifyContent: 'center',
                     alignItems: 'center',
                  }}
               >
                  <img src={url} alt={`업로드 이미지 ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               </Box>
            ))}
         </Box>

         {/* 상품명 입력 필드 */}
         <TextField label="상품명" variant="outlined" fullWidth value={itemNm} onChange={(e) => setItemNm(e.target.value)} placeholder="상품명" sx={{ mt: 2 }} inputProps={{ maxLength: 15 }} />

         {/* 가격 입력 필드 */}
         {/* input type='text'에 입력한 텍스트는 숫자여도 JS에서는 문자로 인식한다 */}
         <TextField
            label="가격"
            variant="outlined"
            fullWidth
            value={formatWithComma(price)} // 콤마 추가된 값 표시
            onChange={handlePriceChange} // 입력 핸들러
            placeholder="가격"
            sx={{ mt: 2 }}
            inputProps={{ maxLength: 10 }}
         />

         {/* 재고 입력 필드 */}
         <TextField label="재고수량" variant="outlined" fullWidth value={stockNumber} onChange={handleStockChange} placeholder="재고수량" sx={{ mt: 2 }} inputProps={{ maxLength: 10 }} />

         {/* 판매 상태 선택 필드 */}
         <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="item-sell-status-label">판매 상태</InputLabel>
            <Select labelId="item-sell-status-label" label="판매상태" value={itemSellStatus} onChange={(e) => setItemSellStatus(e.target.value)}>
               {/* value는 실제 items 테이블의 itemSellStatus 컬럼에 저장될 값 */}
               <MenuItem value="SELL">판매중</MenuItem>
               <MenuItem value="SOLD_OUT">품절</MenuItem>
            </Select>
         </FormControl>

         {/* 상품설명 입력 필드 */}
         <TextField label="상품설명" variant="outlined" fullWidth multiline rows={4} value={itemDetail} onChange={(e) => setItemDetail(e.target.value)} sx={{ mt: 2 }} />

         {/* 수정 버튼 */}
         <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            수정하기
         </Button>
      </Box>
   )
}

export default ItemEditForm
