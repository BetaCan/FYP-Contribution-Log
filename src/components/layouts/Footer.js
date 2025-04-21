import './Footer.scss'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="https://icons8.com" target="_blank" rel="noopener noreferrer">
            Icons by Icons8
          </a>
          <span className="divider">|</span>
          <a href="#" className="terms-link">
            Terms of Service
          </a>
          <span className="divider">|</span>
          <a href="#" className="privacy-link">
            Privacy Policy
          </a>
        </div>
        <div className="copyright">&copy; {currentYear} Sprint Sync. All rights reserved.</div>
      </div>
    </footer>
  )
}

export default Footer
