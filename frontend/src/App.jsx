import Login from './pages/login'
import Signup from './pages/signup'
import { Route, Routes } from 'react-router-dom'

import ProtectedRoutes from './components/ProtectedRoutes'
import PublicRoute from './components/PublicRoute'
import HomePage from './pages/Home'
import InterviewSelection from './pages/InterviewSelection'
import InterviewRoom from './pages/InterviewRoom'


const App = () => {

  return (
    <div>
      <Routes>

        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/" element={<ProtectedRoutes><HomePage /></ProtectedRoutes>} />
        <Route path="/interview" element={<ProtectedRoutes><InterviewSelection /></ProtectedRoutes>} />
        <Route path="/interview-room" element={<ProtectedRoutes><InterviewRoom /></ProtectedRoutes>} />
          
          
        
      </Routes>
    </div>
  )
}

export default App
