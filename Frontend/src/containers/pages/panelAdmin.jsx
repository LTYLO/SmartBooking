import Footer from "components/navigation/Footer"
import Navbar from "components/navigation/Navbar"
import PanelAdmin from "components/panelAdmin"
import Layout from "hocs/layouts/layout"

function Home(){
    return(
        <Layout>
            <Navbar/>
            <PanelAdmin/>
            <Footer/>
        </Layout>
    )
}
export default Home