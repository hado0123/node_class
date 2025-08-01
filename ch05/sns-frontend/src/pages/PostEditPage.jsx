import { useParams } from 'react-router-dom'
import PostEditForm from '../components/post/PostEditForm'
import { Container } from '@mui/material'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPostByIdThunk, updatePostThunk } from '../features/postSlice'

const PostEditPage = () => {
   const navigate = useNavigate()
   const { id } = useParams() //post의 id
   const dispatch = useDispatch()
   const { post, loading, error } = useSelector((state) => state.posts)

   // 게시물 데이터 불러오기
   useEffect(() => {
      dispatch(fetchPostByIdThunk(id))
   }, [dispatch, id])

   // 게시물 수정
   const handleSubmit = (postData) => {
      dispatch(updatePostThunk({ id, postData }))
         .unwrap()
         .then(() => {
            navigate('/') //게시물 수정 후 메인페이지로 이동
         })
         .catch((error) => {
            console.error('게시물 수정 중 오류 발생:', error)
            alert('게시물 수정에 실패했습니다.')
         })
   }

   if (loading) return <p>로딩 중...</p>
   if (error) return <p>에러발생: {error}</p>

   return (
      <Container maxWidth="md">
         <h1>게시물 수정</h1>
         {post && <PostEditForm onSubmit={handleSubmit} initialValues={post} />}
      </Container>
   )
}

export default PostEditPage
