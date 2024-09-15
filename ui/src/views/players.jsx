import { Link } from "react-router-dom"
export default function Players() {
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
