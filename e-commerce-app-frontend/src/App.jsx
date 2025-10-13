import React from "react";
import AppRoutes from "./routes/AppRoutes.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <AppRoutes />
      </main>
      <Footer />
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default App;
