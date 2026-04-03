import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from '../views/signIn/signIn';
import SignUp from '../views/signUp/signUp';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} /> 
        <Route path="/register" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}