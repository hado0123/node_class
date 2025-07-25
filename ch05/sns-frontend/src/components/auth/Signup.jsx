import { TextField, Button, Container, Typography, CircularProgress } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUserThunk } from '../../features/authSlice'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
   const [email, setEmail] = useState('')
   const [nick, setNick] = useState('')
   const [password, setPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')
   const [isSignupComplete, setIsSignupComplete] = useState(false) // 회원가입 완료 상태 추가

   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { loading, error } = useSelector((state) => state.auth)

   const handleSignup = () => {
      if (!email.trim() || !nick.trim() || !password.trim() || !confirmPassword.trim()) {
         alert('모든 필드를 입력해주세요!')
         return
      }

      if (password !== confirmPassword) {
         alert('비밀번호가 일치하지 않습니다!')
         return
      }

      dispatch(registerUserThunk({ email, nick, password }))
         .unwrap()
         .then(() => {
            //회원가입 성공시
            setIsSignupComplete(true) //회원가입 완료 상태 true로 변경
         })
         .catch((error) => {
            //회원가입 중 에러 발생시
            console.error('회원가입 에러:', error)
         })
   }

   //회원가입이 완료 되었을때 보일 컴포넌트
   if (isSignupComplete) {
      return (
         <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom align="center">
               회원가입이 완료되었습니다!
            </Typography>
            <Typography variant="body1" align="center" style={{ marginTop: '20px' }}>
               로그인 페이지로 이동하거나 다른 작업을 계속 진행할 수 있습니다.
            </Typography>
            <Button
               variant="contained"
               color="primary"
               fullWidth
               style={{ marginTop: '20px' }}
               onClick={() => navigate('/login')} // 로그인 페이지로 이동
            >
               로그인 하러 가기
            </Button>
         </Container>
      )
   }

   return (
      <Container maxWidth="sm">
         <Typography variant="h4" gutterBottom>
            회원가입
         </Typography>

         {error && (
            <Typography color="error" align="center">
               {error}
            </Typography>
         )}

         <TextField label="이메일" variant="outlined" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />

         <TextField label="사용자 이름" variant="outlined" fullWidth margin="normal" value={nick} onChange={(e) => setNick(e.target.value)} />

         <TextField label="비밀번호" variant="outlined" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />

         <TextField label="비밀번호 확인" variant="outlined" type="password" fullWidth margin="normal" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

         <Button variant="contained" color="primary" onClick={handleSignup} fullWidth disabled={loading} style={{ marginTop: '20px' }}>
            {loading ? <CircularProgress size={24} /> : '회원가입'}
         </Button>
      </Container>
   )
}

export default Signup
