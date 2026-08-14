import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './UserBar.css'

export default function UserBar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="user-bar">
      <span className="user-bar-name">
        {currentUser?.displayName || 'Welcome'}
        <span className="user-bar-email">{currentUser?.email}</span>
      </span>
      <button className="user-bar-logout" onClick={handleLogout}>
        Log out
      </button>
    </div>
  )
}
