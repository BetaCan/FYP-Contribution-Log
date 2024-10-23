import Layout from './components/layouts/Layout'
import Home from './components/pages/Home'
import SignIn from './components/pages/SignIn'
import ContactUs from './components/pages/ContactUs'
import PageNotFound from './components/pages/404'

import './App.css'

function App() {
    return (
        <Layout>
            <Home />
        </Layout>
    )
}

export default App
