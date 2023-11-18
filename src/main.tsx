import React from 'react'
import ReactDOM from 'react-dom/client'
import SpeedRunCalculator from './SpeedRunCalculator.tsx'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {redirect} from "react-router";
import SophisticatedCalculator from "./SophisticatedCalculator.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        loader: () => {
            return redirect("/1");
        }
    },
    {
        path: "/1",
        element: <SpeedRunCalculator />
    },
    {
        path: "/2",
        element: <SophisticatedCalculator />
    }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
