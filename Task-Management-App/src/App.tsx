import { BrowserRouter, Route, Routes } from "react-router";
import NavBar from "./components/NavBar";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";

const App =() => (
  <BrowserRouter>
    <NavBar appTitle="Team Task Management Hub" />
    <div className="container-fluid p-4">
      <Routes>
        <Route path="/" element={<TaskList />}  />
        <Route path="/edit/:id" element={<TaskForm />}  />
        <Route path="/add" element={<TaskForm />}  />
      </Routes>
    </div>
  </BrowserRouter>
);

export default App;
