import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

export default function Players({ n, nameSetter }) {
    const WS_URL = `http://${location.host.split(':')[0]}:8080/api/players`

    const ws = useRef(null)
    const [players, setPlayers] = useState({})

    const togglePlayer = (name) => {
        let formData = new FormData()
        formData.append("name", name)

        fetch(`http://${location.host.split(':')[0]}:8080/api/togglePlayer`, {
            method: 'POST',
            body: formData,
        })
    }

    const showRole = () => {
        if (!players["Players"]) { return (<></>) }
        for (let player of players["Players"]) {
            if (player.Name === n) {
                if (player.Role == 1) {
                    return (<p className="text-lg p-2">Unassigned</p>)
                } else if (player.Role == 2) {
                    return (<p className="text-lg p-2">Crewmate</p>)
                } else if (player.Role == 3) {
                    return (<div className="p-2">
                        <p className="text-lg">Imposter! Your team is:</p>
                        {players["Players"]
                            .filter((x) => x.Role == 3)
                            .sort(playerSort)
                            .map((p) => <p className="text-lg">{p.Name}</p>)}
                    </div>)
                }
            }
        }
    }

    const buildPlayer = (player) => {
        return (
            <tr key={player.Name}>
                <td>
                    {
                        (player.Alive && Number(player.Role) !== 1) ?
                            <div class="badge badge-sm bg-lime-500"></div> :
                            <div class="badge badge-sm badge-neutral"></div>
                    }
                </td>
                <td>
                    <h4 className="font-bold text-base">
                        {player.Name}
                    </h4>
                </td>
                {Number(player.Role) !== 1 ?
                    <>
                        <td>
                            {player.Alive ?
                                <button className="btn bg-red-500 hover:bg-red-600 w-fit" onClick={() => togglePlayer(player.Name)}>KILL</button> :
                                <button className="btn btn-neutral w-fit" onClick={() => togglePlayer(player.Name)}>REVIVE</button>
                            }
                        </td>
                    </> :
                    <>
                        <td>
                            <button className="btn btn-neutral w-fit btn-disabled" onClick={() => togglePlayer(player.Name)}>OUT</button>
                        </td>
                    </>
                }
            </tr>
        )
    }

    useEffect(() => {
        ws.current = new WebSocket(WS_URL)

        ws.current.addEventListener("message", (e) => setPlayers(JSON.parse(e.data)))

        const wsCurrent = ws.current
        return () => wsCurrent.close()
    }, [])

    const playerSort = (a, b) => {
        if (a.Name == b.Name) {
            return 0
        } else if (a.Name.toUpperCase() > b.Name.toUpperCase()) {
            return 1
        } else { return -1 }
    }

    return (
        <div className="flex flex-col min-h-screen justify-start items-center pt-4">
            <div className="w-10/12">
                <div className="content-center w-full join">
                    <Link className="btn btn-lg btn-primary w-1/2 text-4xl join-item" to={"/players"}><button >Players</button></Link>
                    <Link className="btn btn-lg btn-tertiary w-1/2 text-4xl join-item" to={"/register"}><button >Register</button></Link>
                </div>

                {n !== "" &&
                    <div className="collapse bg-base-200 mt-2 collapse-arrow">
                        <input type="checkbox" />
                        <div className="collapse-title text-xl font-medium">{n} Role</div>
                        <div className="collapse-content">
                            {showRole()}
                            <div className="btn btn-md btn-accent" onClick={() => { nameSetter("") }}>Reset Name</div>
                        </div>
                    </div>
                }

                <div class="card bg-base-100 w-full shadow-xl">
                    <div class="card-body">
                        <h2 class="card-title text-2xl">Player Status</h2>
                        <div className="overflow-x-scroll">
                            <table className="table">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th className="w-5"></th>
                                        <th>Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {players["Players"] ?
                                        <>
                                            {players["Players"]
                                                .filter((x) => x.Alive == true && x.Role != 1)
                                                .sort(playerSort)
                                                .map((p) => buildPlayer(p))}
                                            {players["Players"]
                                                .filter((x) => x.Alive == false && x.Role != 1)
                                                .sort(playerSort)
                                                .map((p) => buildPlayer(p))}
                                            {players["Players"]
                                                .filter((x) => x.Role == 1)
                                                .sort(playerSort)
                                                .map((p) => buildPlayer(p))}
                                        </> :
                                        <></>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
