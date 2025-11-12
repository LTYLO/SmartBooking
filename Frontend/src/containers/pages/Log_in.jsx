import Footer from "components/navigation/Footer"
import Navbar from "components/navigation/Navbar"
import Body from "components/navigation/Body"

import Layout from "hocs/layouts/layout"

function Home(){
    return(
        <Layout>
            <Navbar/>
            
            <Footer/>

        </Layout>
    )
}
export default Home