import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import GetNewDog from "./components/get-new-dog/GetNewDog";
import SignInWithGoogle from "./components/sign-in/SignInWithGoogle";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/get-new-dog" element={<GetNewDog />}></Route>
        <Route path="/login" element={<SignInWithGoogle />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
