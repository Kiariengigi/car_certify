import { Navbar, Container, Nav, Button, NavbarBrand, Row} from 'react-bootstrap';
import hero from '../assets/heroimg.png'
import '../Styles/hero_styles.css'
function Hero(){
    return(
        <section>
            <Container>
                <Row>
            <div className="col-4 header_content align-content-center">
            <h1>Find the Real <span className="bg-black text-white px-2">Story</span></h1>
            <p className="hero_text">Get comprehensive insights into your vehicle's past with CarCertify.</p>
            <div className="license_input border border-black d-flex p-2 rounded-5">
                <input className="border-0" type="text" name="" id=""/>
                <input type="button" value="Submit" className="ms-auto rounded-5 bg-black border-0 text-white px-4 py-2"/>
            </div>
        </div>
        <div className="col-7 header_image ms-4">
            <img style={{width: '70rem'}} src={hero} alt="CarCertify Hero Image"/>
        </div>
                </Row>
            </Container>
</section>
    )
}

export default Hero