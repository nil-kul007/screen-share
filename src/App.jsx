import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'


const App = () => {
  return (
    <div className='row'>
      <Routes>
          <Route path='/:userTyp' element={<Home />} />
        </Routes>
    </div>
  )
}

export default App