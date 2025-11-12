import Footer from "components/navigation/Footer"
import Navbar from "components/navigation/Navbar"
import Body from "components/navigation/Body"
import SignIn from "components/Sing-up"
import Layout from "hocs/layouts/layout"

function Sing_up(){
    return(
        <Layout>
            <Navbar/>
                <SignIn/>
            <Footer/>

        </Layout>
    )
}
export default Sing_up