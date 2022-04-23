import logo from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom/client';

let longitude = 0
let latitude = 0

function handleSubmit(event) {
    console.log(this.latitude, this.longitude)
    console.log(event)
    event.preventDefault()
}

function handleLatChange(event) {
    latitude = event.target.value
}

function handleLonChange(event){
    longitude =  event.target.value
}

const form = <form onSubmit={handleSubmit}>
    <label>Latitude: <textarea value={latitude} onChange={handleLatChange}> </textarea></label>
    <label>Longitude: <textarea value={longitude} onChange={handleLonChange}> </textarea></label>
    <input type="submit" value="Submit"/>
</form>

function componentDidMount() {
    navigator.geolocation.getCurrentPosition(function (position){
        console.log("Latitude is :", position.coords.latitude);
        console.log("Longitude is :", position.coords.longitude);
    }, function (){
        let root = ReactDOM.createRoot(document.getElementById("root"))
        root.render(form, document.getElementById("form"))
    });
}

function App() {
    componentDidMount()
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
