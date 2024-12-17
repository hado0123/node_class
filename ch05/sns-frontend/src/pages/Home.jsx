import { Container, Typography, Pagination, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPostsThunk } from '../features/postSlice'

const Home = ({ isAuthenticated, user }) => {
   const [page, setPage] = useState(1) // 현재 페이지
   const dispatch = useDispatch()
   const { posts, pagination, loading, error } = useSelector((state) => state.posts)

   useEffect(() => {
      dispatch(fetchPostsThunk(page))
   }, [dispatch, page])

   return (
      <Container maxWidth="xs">
         <Typography variant="h4" align="center" gutterBottom>
            Home Feed
         </Typography>

         <Typography variant="body1" align="center">
            로딩 중...
         </Typography>

         <Typography variant="body1" align="center" color="error">
            에러 발생:
         </Typography>

         <>
            <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}></Stack>
         </>

         <Typography variant="body1" align="center">
            게시물이 없습니다.
         </Typography>
      </Container>
   )
}

export default Home
