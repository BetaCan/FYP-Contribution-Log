import Modal from "../UI/Modal.js"
import Header from "./Header"
import Navbar from "./Navbar"
import Footer from "./Footer"

import "./Layout.scss"

function Layout(props) {
  // Properties -------------------------------------------------------------------------------------------------

  // Hooks ------------------------------------------------------------------------------------------------------

  // Context ----------------------------------------------------------------------------------------------------

  // Methods ----------------------------------------------------------------------------------------------------

  // View -------------------------------------------------------------------------------------------------------

  return (
    <Modal.Provider>
      <div className="centrepane">
        <Header />
        <Navbar />
        <main>{props.children}</main>
        <Footer />
      </div>
    </Modal.Provider>
  )
}

export default Layout
