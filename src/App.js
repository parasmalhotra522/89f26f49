import { Routes, Route } from 'react-router-dom';
import Home from './components/Home.component.jsx';
import CallDetail from './components/CallDetail.component.jsx';

const App = () => {

  return (
   <Routes>
    <Route path="/" element={<Home />}>
      <Route path='callDetails/:id' element={<CallDetail/>}/>
    </Route>
    
  </Routes>
  );
};

export default App;
