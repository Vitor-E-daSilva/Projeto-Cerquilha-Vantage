import { Link } from "react-router-dom"

function Sidebar() {

  return (

    <aside className="sidebar">

      <h2 className="sidebar-logo">
        # CERQUILHA
      </h2>

      <nav className="sidebar-links">

        <Link to="/">
          Gestão
        </Link>

        <Link to="/dashboard">
          Dashboard
        </Link>

      </nav>

    </aside>
  )
}

export default Sidebar