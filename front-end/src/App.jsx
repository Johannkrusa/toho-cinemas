import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/home'
import Navbar from './components/navbar'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import ScrollToTop from './components/scrollToTop'
import MoviesPage from './pages/movies'


function App() {

  return (
    <>
      <ScrollToTop></ScrollToTop>
      <Navbar></Navbar>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/register' element={<RegisterPage/>} />
        <Route path='/movies' element={<MoviesPage/>} />
      </Routes>
    </>
  )
}

export default App
