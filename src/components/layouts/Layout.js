import Modal from '../UI/Modal.js'
import Header from './Header'
import Navbar from './Navbar'
import Footer from './Footer'

import './Layout.scss'

function Layout(props) {
  return (
    <Modal.Provider>
      <div className="app-layout">
        <Header />
        <Navbar />
        <main className="app-main">
          <div className="content-wrapper">{props.children}</div>
        </main>
        <Footer />
      </div>
    </Modal.Provider>
  )
}

export default Layout
