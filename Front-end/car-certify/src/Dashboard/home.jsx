import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Header from '../Landing/header'
import Main_Dash from '../Dashboard/main_dash'
import Filter from '../Dashboard/Filters'
function Home(){
    return(
        <>
        <Header/>
        <Filter/>
        </>
    )
}

export default Home