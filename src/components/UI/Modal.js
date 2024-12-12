import { createContext, useContext, useState, useCallback } from "react"
import Card from "./Card.js"
import {
  ActionTray,
  ActionAdd,
  ActionClose,
  ActionDelete,
  ActionFavourites,
  ActionListAll,
  ActionModify,
  ActionNo,
  ActionSubscribe,
  ActionUnsubscribe,
  ActionYes,
} from "./Actions.js"
import "./Modal.scss"

const ModalContext = createContext()

const useModal = () => useContext(ModalContext)

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
              <ActionTray>
                {actions.map((action, index) => {
                  switch (action.type) {
                    case "add":
                      return <ActionAdd key={index} {...action.props} />
                    case "close":
                      return <ActionClose key={index} {...action.props} />
                    case "delete":
                      return <ActionDelete key={index} {...action.props} />
                    case "favourites":
                      return <ActionFavourites key={index} {...action.props} />
                    case "listAll":
                      return <ActionListAll key={index} {...action.props} />
                    case "modify":
                      return <ActionModify key={index} {...action.props} />
                    case "no":
                      return <ActionNo key={index} {...action.props} />
                    case "subscribe":
                      return <ActionSubscribe key={index} {...action.props} />
                    case "unsubscribe":
                      return <ActionUnsubscribe key={index} {...action.props} />
                    case "yes":
                      return <ActionYes key={index} {...action.props} />
                    default:
                      return null
                  }
                })}
              </ActionTray>
            </div>
          )}
        </Card>
      </main>
    </div>
  ) : null
}

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
