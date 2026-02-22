import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Milestones from './pages/Milestones'
import About from './pages/About'
import Messages from './pages/Messages'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="milestones" element={<Milestones />} />
        <Route path="about" element={<About />} />
        <Route path="messages" element={<Messages />} />
      </Route>
    </Routes>
  )
}
