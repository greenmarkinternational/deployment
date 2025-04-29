import React from "react";
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from "react-router-dom";
import axios from "axios"
import Form from "./Form";

axios.defaults.withCredentials = true;

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Form />} />
    </>
  )
);


function App() {
  return <RouterProvider router={router} />;
}

export default App;

