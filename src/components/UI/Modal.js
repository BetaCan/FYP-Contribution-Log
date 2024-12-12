import { createContext, useContext, useState, useCallback } from "react"
import Card from "./Card.js"
import Action from "./Actions.js"
import "./Modal.scss"

const ModalContext = createContext()

export default function Modal() {
  // Properties ----------------------------------
  // State ---------------------------------------
  // Context -------------------------------------
  const {
    modal: { show, title, content, actions },
  } = useModal()

  // Methods -------------------------------------
  // View ----------------------------------------
  return show ? (
    <div className="ModalOverlay">
      <main className="ModalPane">
        <Card>
          <header>
            <p>{title}</p>
          </header>
          <main className="ModalContent">{content}</main>
          {actions && (
            <div className="ModalActions">
              <Action.Tray>{actions.map((action) => action)}</Action.Tray>
            </div>
          )}
        </Card>
      </main>
    </div>
  ) : null
}

const useModal = () => useContext(ModalContext)

const Provider = ({ children }) => {
  // Properties ----------------------------------
  // State ---------------------------------------
  const [modal, setModal] = useState({ show: false, title: null, content: null, actions: null })

  // Context -------------------------------------
  // Methods -------------------------------------
  const handleModal = useCallback((newModal) => {
    newModal.show
      ? setModal(newModal)
      : setModal({ show: false, title: null, content: null, actions: null })
  }, [])

  // View ----------------------------------------
  return (
    <ModalContext.Provider value={{ modal, handleModal }}>
      <Modal />
      {children}
    </ModalContext.Provider>
  )
}

// -----------------------------------------
// Compose Modal Object ////////////////////
// -----------------------------------------

Modal.useModal = useModal
Modal.Provider = Provider
