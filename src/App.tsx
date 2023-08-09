import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import GetNewDog from "./components/get-new-dog/GetNewDog";
import Login from "./components/login/Login";
import AllMyDogs from "./components/all-my-dogs/AllMyDogs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/get-new-dog" element={<GetNewDog />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/all-my-dogs" element={<AllMyDogs />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
