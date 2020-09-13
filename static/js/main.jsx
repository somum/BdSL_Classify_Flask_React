//import { Button } from 'reactstrap';
//import React from 'react';
const Button = window.Reactstrap.Button;


const Collapse = window.Reactstrap.Collapse;
const Navbar = window.Reactstrap.Navbar;
const NavbarBrand = window.Reactstrap.NavbarBrand;
const Nav = window.Reactstrap.Nav;
const NavItem = window.Reactstrap.NavItem;
const NavLink = window.Reactstrap.NavLink;


const Router = window.ReactRouterDOM.BrowserRouter;
const Route = window.ReactRouterDOM.Route;
const ReactMarkdown = window.ReactMarkdown;

const Form = window.Reactstrap.Form;
const FormGroup = window.Reactstrap.FormGroup;
const Label = window.Reactstrap.Label;
const Input = window.Reactstrap.Input;


const UncontrolledDropdown = window.Reactstrap.UncontrolledDropdown;
const Dropdown = window.Reactstrap.Dropdown;
const DropdownToggle = window.Reactstrap.DropdownToggle;
const DropdownMenu = window.Reactstrap.DropdownMenu;
const DropdownItem = window.Reactstrap.DropdownItem;
const Spinner = window.Reactstrap.Spinner;
const WebcamComponent = window.Reactstrap


const axios = window.axios;

const Select = window.Select;



// Obtain the root 
const rootElement = document.getElementById('root');


class About extends React.Component {

    // Use the render function to return JSX component
    render() {
        return (

            <div>
                <h1>About</h1>
                <ReactMarkdown source={window.APP_CONFIG.about} />
            </div>
        );
    }
}


// class component
class MainPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            predictions: [],
            imageSelectedU: false,
            imageSelectedC: false,
            url: null,
            isLoading: false,
            selectedOption: null,
            count: 3

        }
    }


    _onFileUpload = (event) => {
        console.log("Raw ", URL.createObjectURL(event.target.files[0]));
        this.setState({
            rawFile: event.target.files[0],
            file: URL.createObjectURL(event.target.files[0]),
            imageSelectedU: true,
            imageSelectedC: false
        })
    };

    _clear = async (event) => {
        this.setState({
            file: null,
            imageSelectedC: false,
            imageSelectedU: false,
            imageSelected: false,
            predictions: [],
            rawFile: null,
            url: ""
        })
    };

    _predict = async (event) => {
        this.setState({ isLoading: true });
        this.setState({ imageSelected: true });
        let resPromise = null;
        if (this.state.rawFile) {
            const data = new FormData();
            data.append('file', this.state.rawFile);
            console.log(data);
            resPromise = axios.post('/api/classify', data);
        } else {
            resPromise = axios.get('/api/classify', {
                params: {
                    url: this.state.file
                }
            });
        }

        try {
            const res = await resPromise;
            const payload = res.data;

            this.setState({ predictions: payload.predictions, isLoading: false });
            console.log(payload)
        } catch (e) {
            alert(e)
        }
    };
    _setRef = webcam => {
        this.webcam = webcam;
    };
    b64toBlob(dataURI) {

        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);

        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/jpeg' });
    }

    timer = () => {
        let cnt = this.state.count
        cnt--;
        this.setState({ count: cnt });
    }

    _capture = async (event) => {



        //setTimeout(this.timer,3000);
        // setTimeout(this.timer,1000);
        // setTimeout(this.timer,1000);

        setTimeout(async () => {
            const imageSrc = this.webcam.getScreenshot();
            const l = this.b64toBlob(imageSrc)
            console.log("Blob ", l)
            this.setState({
                rawFile: l,
                file: imageSrc,
                imageSelectedC: true,
                imageSelectedU: false,
                imageSelected: false,
                count: 4
            })
            this.setState({ isLoading: true });

            let resPromise = null;
            //if kono raw file thake
            if (this.state.rawFile) {
                const data = new FormData();
                data.append('file', this.state.rawFile);
                console.log(data);
                //resPromise = predict(data);
                resPromise = axios.post('/api/classify', data);
                console.log("resPros ", resPromise);
            } else {
                resPromise = axios.get('/api/classify', {
                    params: {
                        url: this.state.file
                    }
                });
            }

            try {
                const res = await resPromise;
                const payload = res.data;

                this.setState({ predictions: payload.predictions, isLoading: false });
                console.log(payload)
            } catch (e) {
                alert(e)
            }
        }, 3000);

    };


    renderPrediction() {
        const predictions = this.state.predictions || [];

        if (predictions.length > 0) {

            const predictionItems = predictions.map((item) =>
                <li>{item.class} ({item.prob * 100}%) </li>
            );

            return (
                <ul>
                    {predictionItems}
                </ul>
            )

        } else {
            return null
        }
    }

    handleChange = (selectedOption) => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
    };

    sampleUrlSelected = (item) => {
        this._onUrlChange(item.url);
    };
    render() {
        const videoConstraints = {
            width: 450,
            height: 250,
            facingMode: "user"
        };
        return (
            <div>
                <h2>{APP_CONFIG.description}</h2>
                <Form>
                    {/*image capture*/}
                    <div className="rowC">

                        <FormGroup>
                            <div  >
                                <Webcam
                                    audio={false}
                                    // height={350}
                                    ref={this._setRef}
                                    screenshotFormat="image/png"
                                    // width={350}
                                    videoConstraints={videoConstraints}

                                />

                            </div>
                            <p hidden={this.state.count == 4}> Captures after {this.state.count} seconds</p>
                            <Button color="success" onClick={this._capture} disabled={this.state.isLoading}>Capture photo</Button>
                            <span className="p-1 " />

                        </FormGroup>

                    </div>

                    <img src={this.state.file} className={"img-preview"} hidden={!this.state.imageSelectedC} />
                    {this.state.imageSelectedC && this.renderPrediction()}
                    <h3>OR</h3>
                    <FormGroup id={"upload_button"}>
                        <div>
                            <p>Upload an image</p>
                        </div>
                        <Label for="imageUpload">
                            <Input type="file" name="file" id="imageUpload" accept=".png, .jpg, .jpeg" ref="file"
                                onChange={this._onFileUpload} />
                            <span className="btn btn-primary">Upload</span>
                        </Label>
                    </FormGroup>

                    <img src={this.state.file} className={"img-preview"} hidden={!this.state.imageSelectedU} />
                    <FormGroup>
                        <Button color="success" onClick={this._predict}
                            disabled={this.state.isLoading}> Predict</Button>
                        <span className="p-1 " />
                        <Button color="danger" onClick={this._clear}> Clear</Button>
                    </FormGroup>


                    {this.state.isLoading && (
                        <div>
                            <Spinner color="primary" type="grow" style={{ width: '5rem', height: '5rem' }} />

                        </div>
                    )}

                </Form>

                {this.state.imageSelected && this.renderPrediction()}

                <h5>Reference Image</h5>
                <img style={{ width: 820, height: 400, padding: 10 }} src={APP_CONFIG.image.url} />


            </div>
        );
    }
}

//navigation er kaj kortese
class CustomNavBar extends React.Component {


    render() {
        const link = APP_CONFIG.code;
        return (
            <Navbar color="light" light fixed expand="md">
                <NavbarBrand href="/">{APP_CONFIG.title}</NavbarBrand>
                <Collapse navbar>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink href="/about">About</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href={link}>GitHub</NavLink>
                        </NavItem>

                    </Nav>
                </Collapse>
            </Navbar>
        )
    }
}

// a function to wrap up component
function App() {
    return (


        <Router>
            <div className="App">
                <CustomNavBar />
                <div>
                    <main role="main" className="container">
                        <Route exact path="/" component={MainPage} />
                        <Route exact path="/about" component={About} />

                    </main>
                </div>
            </div>
        </Router>
    )
}


//app ta k dekhanor jonno
(async () => {
    const response = await fetch('/config');
    const body = await response.json();

    window.APP_CONFIG = body;

    // ReactDOM.render to show component on the browser
    ReactDOM.render(
        <App />,
        rootElement
    )
})();


