import './App.css'
import {HashRouter as Router, Routes, Route} from "react-router-dom"
import { Home } from './pages/Home'
import { Order } from './pages/Order'
import { Navbbar } from './components/Navbar'
import { Layout } from './components/Layout'

function App() {



  return (
    <Router>
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<Home/>}/>
          <Route path="/order/:id" element={<Order/>}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
