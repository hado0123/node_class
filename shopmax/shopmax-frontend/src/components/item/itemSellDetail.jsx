import { Box, Typography, Button, Alert, CardMedia } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { NumberInput } from '../../styles/NumberInputBasic'
import LocalMallIcon from '@mui/icons-material/LocalMall'
import { fetchItemByIdThunk } from '../../features/itemSlice'
import { formatWithComma } from '../../utils/priceSet'

import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

function ItemSellDetail() {
   const { id } = useParams() // item의 id
   const dispatch = useDispatch()
   const { item, error, loading } = useSelector((state) => state.items)
   const [count, setCount] = useState(1) // 수량
   const [orderPrice, setOrderPrice] = useState(0) // 총 상품가격

   //상품 데이터 불러오기
   useEffect(() => {
      dispatch(fetchItemByIdThunk(id))
   }, [dispatch, id])

   // 수량 증가시 총 가격 계산
   // 처음에 상세 페이지 들어왔을때 수량이 1개일때의 총 상품가격도 보여주기위해 useEffect 사용
   useEffect(() => {
      if (item) {
         //상품이 있다면
         setOrderPrice(item.price * count) // 상품가격 * 수량
      }
   }, [item, count])

   // 수량증가
   const handleQuantityChange = useCallback((event, value) => {
      setCount(value)
   }, [])

   if (loading) {
      return null //아무것도 보여주지 X
   }

   if (error) {
      return (
         <Typography variant="body1" align="center" color="error">
            에러 발생: {error}
         </Typography>
      )
   }

   return (
      <>
         {item && (
            <Box sx={{ padding: '20px' }}>
               {/* 위쪽 상세 */}
               <Grid
                  container
                  spacing={4}
                  sx={{ justifyContent: 'center', alignItems: 'center' }} // 추가된 스타일
               >
                  <Grid container spacing={10}>
                     {/* 왼쪽 이미지 */}
                     <Grid xs={12} md={6}>
                        <CardMedia component="img" image={`${process.env.REACT_APP_API_URL}${item.Imgs.filter((img) => img.repImgYn === 'Y')[0].imgUrl}`} alt={item.itemNm} sx={{ width: '450px', borderRadius: '8px' }} />
                     </Grid>

                     {/* 오른쪽 상세 정보 */}
                     <Grid xs={12} md={6}>
                        <Typography variant="h4" gutterBottom>
                           <LocalMallIcon sx={{ color: '#ffab40', fontSize: '32px' }} />
                           {item.itemNm}
                        </Typography>

                        <Typography variant="h6" gutterBottom>
                           가격: {formatWithComma(String(item.price))}원
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                           현재 재고: {item.stockNumber}개
                        </Typography>

                        {item.itemSellStatus === 'SOLD_OUT' ? (
                           <Alert severity="error">품절</Alert>
                        ) : (
                           <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
                              <NumberInput aria-label="Demo number input" placeholder="수량" value={count} onChange={handleQuantityChange} min={1} max={item.stockNumber} />
                              <Typography variant="h6">총 가격: {formatWithComma(String(orderPrice))}원</Typography>
                              <Button variant="contained" color="primary">
                                 구매하기
                              </Button>
                           </Box>
                        )}
                     </Grid>
                  </Grid>
               </Grid>

               {/* 상세 이미지 */}
               <Box sx={{ marginTop: '180px' }}>
                  <Typography variant="h5" gutterBottom>
                     상세 정보
                  </Typography>
                  <Typography variant="body1" gutterBottom sx={{ mt: 4, mb: 5 }}>
                     {item.itemDetail}
                  </Typography>
                  <Grid container spacing={2}>
                     {item.Imgs.map((img, index) => (
                        <Grid xs={12} sm={6} md={4} key={index}>
                           <CardMedia component="img" image={`${process.env.REACT_APP_API_URL}${img.imgUrl}`} alt={`상세 이미지 ${index + 1}`} sx={{ width: '100%', borderRadius: '8px' }} />
                        </Grid>
                     ))}
                  </Grid>
               </Box>
            </Box>
         )}
      </>
   )
}

export default ItemSellDetail
