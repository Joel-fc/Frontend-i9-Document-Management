import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from '../views/signIn/signIn';
import SignUp from '../views/signUp/signUp';
import Projects from '../views/projects/projects';
import ProjectDetailsPage from '../views/projectDetails/ProjectDetailsPage';
import EmployeeDocumentsPage from '../views/employeeDocuments/EmployeeDocumentsPage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} /> 
        <Route path="/register" element={<SignUp />} />
        <Route path="/projects" element={<Projects/>} />
        <Route path="/projects/:id" element={<ProjectDetailsPage />} />
        <Route path="/employees/:id/documents" element={<EmployeeDocumentsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
