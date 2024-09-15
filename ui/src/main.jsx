import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom"
import Players from './views/players.jsx'
import Register from './views/register.jsx'

const router = createBrowserRouter([
    {
        path: "/",
        element: <Players />
    },
    {
        path: "/players",
        element: <Players />
    },
    {
        path: "/register",
        element: <Register />
    }
])

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
)
