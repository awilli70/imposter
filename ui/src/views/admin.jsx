import { useState } from "react";
import { Link } from "react-router-dom"
import amogus from "../imgs/imposter.png"

export default function Admin() {
    const [imposters, setImposters] = useState(2)

    const sendRegister = () => {
        let formData = new FormData()
        formData.append("imposters", imposters)

        fetch(`http://${location.host.split(':')[0]}:8080/api/start`, {
            method: 'POST',
            body: formData,
        })
    }

    const sendReset = () => {
        fetch(`http://${location.host.split(':')[0]}:8080/api/reset`, {
            method: 'POST',
        })
    }

    const sendRestart = () => {
        fetch(`http://${location.host.split(':')[0]}:8080/api/restart`, {
            method: 'POST',
        })
    }

    return (
        <div className="flex flex-col min-h-screen justify-start items-center pt-4">
            <div className="w-10/12">
                <div className="content-center w-full join">
                    <Link className="btn btn-lg btn-tertiary w-1/2 text-4xl join-item" to={"/players"}><button >Players</button></Link>
                    <Link className="btn btn-lg btn-tertiary w-1/2 text-4xl join-item" to={"/register"}><button >Register</button></Link>
                </div>
            </div>
            <div className="card bg-base-100 w-10/12 shadow-xl mt-4">
                <figure>
                    <img className="h-24" src={amogus} alt="pink amogus" />
                </figure>
                <div className="card-body text-center items-center">
                    <h2 className="card-title text-3xl text-bold">Super Secret Admin View</h2>
                    <div className="join w-full m-2">
                        <div className="w-28 join-item btn btn-secondary pointer-events-none">Imposter Count</div>
                        <input type="number" placeholder={2}
                            value={imposters}
                            onChange={e => setImposters(Number(e.target.value))}
                            className="join-item input input-bordered flex items-center gap-2 w-full focus:outline-none" />
                    </div>
                    <button className="btn btn-primary w-1/2 m-2" onClick={() => sendRegister()}>Start Game</button>
                    <button className="btn btn-secondary w-1/2 m-2" onClick={() => sendReset()}>Reset Game</button>
                    <button className="btn btn-accent w-1/2 m-2" onClick={() => sendRestart()}>Remove All Players</button>
                </div>
                <div className="card-actions text-center items-center">
                </div>
            </div>
        </div>
    )
}
