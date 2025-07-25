import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState, useCallback } from 'react'
import { getProfileThunk, getProfileIdThunk } from '../../features/pageSlice'
import { followUserThunk } from '../../features/userSlice'

const MyProfile = ({ auth }) => {
   const { id } = useParams() // 게시물의 이름 클릭시 path 파라미터에 사용자 id존재, navbar 이름 클릭시 path 파라미터에 사용자 id X
   const [followers, setFollowers] = useState(0) // 팔로워수
   const [followings, setFollowings] = useState(0) // 팔로잉수
   const [follow, setFollow] = useState(false) // 팔로우 여부

   const dispatch = useDispatch()
   const { user } = useSelector((state) => state.page)

   // useCallback을 사용하여 fetchProfileData 함수를 메모이제이션
   // useCallback을 하지 않으면 fetchProfileData가 무한반복되서 실행하므로 꼭 useCallback처리
   // fetchProfileData() 실행 → state 변화 → 렌더링 → 함수 재생성 → 의존성 변화 감지 → 다시 useEffect() 실행 -> 무한반복
   const fetchProfileData = useCallback(() => {
      if (id) {
         dispatch(getProfileIdThunk(id)) // 다른 사람 프로필 정보
            .unwrap() // Thunk의 결과를 추출
            .then((response) => {
               setFollowers(response.Followers.length)
               setFollowings(response.Followings.length)
            })
            .catch((error) => {
               alert(error)
            })
      } else {
         dispatch(getProfileThunk()) // 내 정보
            .unwrap() // Thunk의 결과를 추출
            .then((response) => {
               setFollowers(response.Followers.length)
               setFollowings(response.Followings.length)
            })
            .catch((error) => {
               alert(error)
            })
      }
   }, [dispatch, id]) // 의존성 배열에 필요한 값 추가

   useEffect(() => {
      fetchProfileData()
   }, [fetchProfileData, follow]) // follow가 변경될 때만 데이터를 다시 가져옴

   const onClickFollow = (id) => {
      dispatch(followUserThunk(id))
         .unwrap()
         .then(() => {
            alert('팔로우 되었습니다!')
            setFollow((prev) => !prev) // follow 상태 true로 변경 -> state가 바뀌면 컴포넌트가 재렌더링 되면서 Followers, Followings 인원수가 바뀌어 보인다
         })
         .catch((error) => {
            console.error('팔로우 중 :', error)
            alert('팔로우를 실패했습니다.', error)
         })
   }

   return (
      <>
         {user && auth && (
            <Card sx={{ minWidth: 275 }}>
               <CardContent>
                  <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                     {user.email}
                  </Typography>
                  <Typography variant="h5" component="div">
                     {user.nick}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>자기소개</Typography>
                  <Typography variant="body2">
                     {followers} Followers &nbsp;&nbsp;&nbsp; {followings} Followings
                  </Typography>
               </CardContent>
               <CardActions sx={{ p: 2 }}>
                  <Button
                     variant="contained"
                     onClick={() => onClickFollow(`${user.id}`)} //follow 실행
                     // 내 페이지 이거나(메뉴바에서 이름을 클릭한 경우) || 로그인한 사람의 id와 내 페이지의 path 파라메터 :id가 같거나(게시물에서 내 이름을 클릭한 경우) || 이미 팔로우를 한 사용자인 경우(로그인 한 사람이 마이페이지 사람을 팔로우 했는지 찾음)
                     /*
                      마이페이지의 사람을 팔로우한 사람의 데이터
                      user.Followers = [
                        {id: 1, nick: '하서'..}
                        {id: 2, nick: '지은'..}
                      ]
                      
                      f.id = 마이페이지의 사람을 팔로우한 사람의 id
                      auth.id = 로그인한 사람의 id 
                     
                     */
                     disabled={!id || String(auth.id) === String(id) || user.Followers.filter((f) => f.id === auth.id).length > 0 ? true : false}
                  >
                     Follow
                  </Button>
               </CardActions>
            </Card>
         )}
      </>
   )
}

export default MyProfile
