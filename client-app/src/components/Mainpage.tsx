import { useState } from "react"
import Home from "./Home"
import Navbar from "./Navbar"

const Mainpage = () => {
  const [search, setSearch] = useState("")

  return (
    <div className="h-screen w-screen">
      <Navbar setSearch={setSearch} />
      <Home search={search} />
    </div>
  )
}

export default Mainpage