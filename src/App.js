import { ToastContainer } from "react-toastify";
import { Container } from "react-bootstrap";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./components/Routes/Routes";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Router>
            <AuthProvider>
              <Routes />
            </AuthProvider>
          </Router>
        </div>
      </Container>
      <ToastContainer />
    </>
  );
};

export default App;
