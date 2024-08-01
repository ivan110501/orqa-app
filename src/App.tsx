import Layout from "./components/layout";
import { Routes, Route } from "react-router-dom";

import NoMatch from "./pages/no-match";

import Dijagram from "./pages/diagram";
import Employees from "./pages/employees";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Employees />} />

          <Route path="diagram" element={<Dijagram />} />

          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
