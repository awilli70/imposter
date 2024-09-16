import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

export default function Players() {
    const WS_URL = "http://127.0.0.1:8080/players"

    const ws = useRef(null)
    const [players, setPlayers] = useState({})

    const togglePlayer = (name) => {
        let formData = new FormData()
        formData.append("name", name)

        fetch('http://127.0.0.1:8080/togglePlayer', {
            method: 'POST',
            body: formData,
        })
    }

    const buildPlayer = (player) => {
        return (
            <tr key={player.Name}>
                <td>
                    <div className="font-bold w-28">{player.Name}</div>
                </td>
                <td className="w-full">
                    {player.Alive ?
                        <div class="badge bg-lime-500">Alive</div> :
                        <div class="badge badge-neutral">Dead</div>
                    }
                </td>
                <td>
                    {player.Alive ?
                        <button className="btn bg-red-500 hover:bg-red-600 w-24" onClick={() => togglePlayer(player.Name)}>KILL</button> :
                        <button className="btn btn-neutral w-24" onClick={() => togglePlayer(player.Name)}>RESURRECT</button>
                    }
                </td>
            </tr>
        )
    }

    useEffect(() => {
        ws.current = new WebSocket(WS_URL)

        ws.current.addEventListener("message", (e) => setPlayers(JSON.parse(e.data)))

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

                <div class="card bg-base-100 w-full shadow-xl">
                    <div class="card-body">
                        <h2 class="card-title text-3xl">Player Status</h2>
                        <div className="overflow-x-auto">
                            <table className="table">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(players["Players"]) ? players["Players"].map((p) => buildPlayer(p)) : <></>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
