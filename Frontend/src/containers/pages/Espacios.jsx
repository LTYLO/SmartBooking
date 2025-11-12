import Footer from "components/navigation/Footer"
import Navbar from "components/navigation/Navbar"
import Espacios_Page from "components/Espacios"
import Layout from "hocs/layouts/layout"

function Espacios(){
    return(
        <Layout>
            <Navbar/>
            <Espacios_Page/>
            <Footer/>

        </Layout>
    )
}
export default Espacios