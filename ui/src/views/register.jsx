import { Link, useNavigate } from "react-router-dom"
import amogus from "../imgs/imposter.png"
import { useEffect, useState } from "react"
export default function Register() {
    const [name, setName] = useState("")
    const [number, setNumber] = useState("")
    const [clickCount, setClickCount] = useState(0)

    const sendRegister = () => {
        let formData = new FormData()
        formData.append("name", name)
        formData.append("number", number)

        console.log(location.host.split(':')[0])
        fetch(`http://${location.host.split(':')[0]}:8080/api/register`, {
            method: 'POST',
            body: formData,
        })
        navigate("/players", { replace: true })
    }

    useEffect(() => {
        if (clickCount >= 3) {
            navigate("/admin", { replace: true })
        }
    }, [clickCount])


    const navigate = useNavigate()

    return (
        <div className="flex flex-col min-h-screen justify-start items-center pt-4">
            <div className="w-10/12">
                <div className="content-center w-full join">
                    <Link className="btn btn-lg btn-tertiary w-1/2 text-4xl join-item" to={"/players"}><button >Players</button></Link>
                    <Link className="btn btn-lg btn-primary w-1/2 text-4xl join-item" to={"/register"}><button >Register</button></Link>
                </div>
            </div>
            <div className="card bg-base-100 w-10/12 shadow-xl mt-4">
                <figure>
                    <img className="h-24" src={amogus} alt="pink amogus" onClick={() => setClickCount(clickCount + 1)} />
                </figure>
                <div className="card-body text-center items-center">
                    <h2 className="card-title text-3xl text-bold">Super secure gathering of PII</h2>
                    <h3 className="text-2xl">Give me your information!</h3>
                    <p className="text-xl">I'm validating none of this, please be kind</p>
                    <div className="join w-full m-2">
                        <div className="w-28 join-item btn btn-secondary pointer-events-none">Name</div>
                        <input type="text" placeholder="Name pls 🥺"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="join-item input input-bordered flex items-center gap-2 w-full focus:outline-none" />
                    </div>
                    <div className="join w-full m-2">
                        <div className="w-28 join-item btn btn-secondary pointer-events-none">Number ;)</div>
                        <input type="text" placeholder="555-555-5555"
                            value={number}
                            onChange={e => setNumber(e.target.value)}
                            className="join-item input input-bordered flex items-center gap-2 w-full focus:outline-none" />
                    </div>
                    <button className="btn btn-primary w-1/2 m-2" onClick={() => sendRegister()}>Submit</button>
                </div>
                <div className="card-actions text-center items-center">
                </div>
            </div>
        </div>
    )
}
