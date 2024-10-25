import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom"
import Players from './views/players.jsx'
import Register from './views/register.jsx'
import Admin from './views/admin.jsx'


function App() {
    const [name, setName] = useState(
        JSON.parse(localStorage.getItem('name')) || ""
    )

    useEffect(() => {
        localStorage.setItem('name', JSON.stringify(name))
    }, [name])

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Players n={name} nameSetter={setName} />
        },
        {
            path: "/players",
            element: <Players n={name} nameSetter={setName} />
        },
        {
            path: "/register",
            element: <Register nameSetter={setName} />
        },
        {
            path: "/admin",
            element: <Admin />
        }
    ])

    return (
        <RouterProvider router={router} />
    )

}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
