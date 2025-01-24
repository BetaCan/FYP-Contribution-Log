import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import Home from "./components/pages/Home";
import SignIn from "./components/pages/SignIn";
import ContactUs from "./components/pages/ContactUs";
import MyProjects from "./components/pages/MyProjects";
import Projects from "./components/pages/Projects";
import PageNotFound from "./components/pages/404";
import Logs from "./components/pages/Logs";

import "./App.scss";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/myprojects" element={<MyProjects />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
