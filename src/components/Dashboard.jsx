import React from "react";
import { toast } from "react-toastify";
import { Link, useHistory } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import DescriptionList from "./DescriptionList";
import Header from "./Header";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  const handleLogout = async () => {
    try {
      await logout();
      history.push("/login");
    } catch (e) {
      toast.error("Unable to logout");
    }
  };

  return (
    <>
      <Card>
        <Card.Body>
          <Header heading="Profile" />
          <DescriptionList labelValuePairs={[["Email", currentUser.email]]} />
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </>
  );
};

export default Dashboard;
