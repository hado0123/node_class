import { Card, CardMedia, CardContent, Typography, Box, CardActions, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import dayjs from 'dayjs' //날짜 시간 포맷해주는 패키지
import { deletePostThunk, fetchPostsThunk } from '../../features/postSlice'

const PostItem = ({ post, isAuthenticated, user }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   //게시물 삭제 실행
   const onClickDelete = (id) => {
      dispatch(deletePostThunk(id))
         .unwrap()
         .then(() => {
            // 그냥 navigate만 이동시 삭제된 목록이 보이지 않으므로 삭제 후 바로 리스트 새로 불러오기
            dispatch(fetchPostsThunk())
            navigate('/')
         })
         .catch((error) => {
            console.error('게시물 삭제 중 오류 발생: ', error)
            alert('게시물 삭제에 실패했습니다', error)
         })
   }

   return (
      <Card style={{ margin: '20px 0' }}>
         <CardMedia sx={{ height: 240 }} image={`${import.meta.env.VITE_APP_API_URL}${post.img}`} title={post.content} />
         <CardContent>
            <Link to={`/my/${post.User.id}`} style={{ textDecoration: 'none' }}>
               <Typography sx={{ color: 'primary.main' }}>@{post.User.nick} </Typography>
            </Link>
            <Typography>{dayjs(post.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
            <Typography>{post.content}</Typography>
         </CardContent>
         <CardActions>
            <Button size="small" color="primary">
               <FavoriteBorderIcon fontSize="small" />
            </Button>
            {/* isAuthenticated가 true 이면서 post.User.id와 user.id가 같을때 렌더링 => 내가 작성한 게시글만 수정, 삭제 */}
            {/* 로그인한 상태 이면서 로그인한 사람과 글을 작성한 사람이 같으면 렌더링 */}
            {isAuthenticated && post.User.id === user.id && (
               <Box sx={{ p: 2 }}>
                  <Link to={`/posts/edit/${post.id}`}>
                     <IconButton aria-label="edit" size="small">
                        <EditIcon fontSize="small" />
                     </IconButton>
                  </Link>
                  <IconButton aria-label="delete" size="small" onClick={() => onClickDelete(post.id)}>
                     <DeleteIcon fontSize="small" />
                  </IconButton>
               </Box>
            )}
         </CardActions>
      </Card>
   )
}

export default PostItem
