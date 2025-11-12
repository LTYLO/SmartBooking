import Footer from "components/navigation/Footer"
import Navbar from "components/navigation/Navbar"
import Body from "components/navigation/Body"
import LoginForm from "components/login";

import Layout from "hocs/layouts/layout"

function Home(){
    return(
        <Layout>
            <Navbar/>
            <LoginForm/>
            <Footer/>

        </Layout>
    )
}
export default Home