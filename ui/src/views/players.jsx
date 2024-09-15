import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"

export default function Players() {
    const WS_URL = "http://127.0.0.1:8080/players"

    const ws = useRef(null)

    useEffect(() => {
        ws.current = new WebSocket(WS_URL)

        ws.current.addEventListener("message", (e) => console.log(JSON.parse(e.data)))

        const wsCurrent = ws.current
        return () => wsCurrent.close()
    }, [])

    return (
        <div className="flex flex-col min-h-screen justify-start items-center pt-4">
            <div className="w-10/12">
                <div className="content-center w-full join">
                    <Link className="btn btn-lg btn-primary w-1/2 text-5xl join-item" to={"/players"}><button >Players</button></Link>
                    <Link className="btn btn-lg btn-tertiary w-1/2 text-5xl join-item" to={"/register"}><button >Register</button></Link>
                </div>
            </div>
        </div>
    )
}
