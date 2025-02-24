import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import CreateForm from './pages/create-form';
import ColumnGroupingTable from './pages/grid-data';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ColumnGroupingTable />} />
        <Route path="/create-form" element={<CreateForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
