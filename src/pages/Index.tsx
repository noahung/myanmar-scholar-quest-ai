import Home from "./Home";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IELTSPreparation from "./IELTSPreparation";
import { Route } from "react-router-dom";

// This component serves as an entry point for the application
// It will automatically redirect to the Home page
const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate("/");
  }, [navigate]);
  
  return <Home />;
};

export default Index;
