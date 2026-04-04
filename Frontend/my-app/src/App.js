import logo from './logo.svg';
import './App.css';
import MainPage from './Components/mainpage';
import RegisterPage from './Components/register';
import Header from './Components/header';
import Footer from './Components/footer';
import Login from './Components/login';
import MovieSchedule from './Components/movies';


function App() {
  /*return (
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
  );*/

  return (
    <MovieSchedule />
  );
}

export default App;
