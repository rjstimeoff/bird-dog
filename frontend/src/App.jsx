import { Routes, Route, NavLink } from 'react-router-dom'
import AnalyzePage from './pages/AnalyzePage'
import TrackerPage from './pages/TrackerPage'
import ResumePage from './pages/ResumePage'

const navLinkStyle = (isActive) => ({
  padding: '0.4rem 0.8rem',
  fontSize: '0.9rem',
  textDecoration: 'none',
  borderRadius: '4px',
  color: isActive ? '#1e40af' : '#64748b',
  background: isActive ? '#eff6ff' : 'transparent',
  fontWeight: isActive ? 600 : 400,
})

function App() {
  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '2rem 1rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
      }}>
        <div>
          <h1 style={{ margin: '0 0 0.25rem', fontSize: '1.75rem' }}>Bird Dog</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
            AI-Powered Job Hunting Companion
          </p>
        </div>
        <nav style={{ display: 'flex', gap: '0.25rem' }}>
          <NavLink to="/" end style={({ isActive }) => navLinkStyle(isActive)}>
            Role Analysis
          </NavLink>
          <NavLink to="/tracker" style={({ isActive }) => navLinkStyle(isActive)}>
            Job Tracker
          </NavLink>
          <NavLink to="/resume" style={({ isActive }) => navLinkStyle(isActive)}>
            Resume Review
          </NavLink>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<AnalyzePage />} />
        <Route path="/tracker" element={<TrackerPage />} />
        <Route path="/resume" element={<ResumePage />} />
      </Routes>
    </div>
  )
}

export default App
