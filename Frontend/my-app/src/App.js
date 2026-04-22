import { Routes, Route } from 'react-router-dom';
import './App.css';
import MainPage from './Components/mainpage';
import RegisterPage from './Components/register';
import Header from './Components/header';
import Footer from './Components/footer';
import Login from './Components/login';
import Movies from './Components/movies';
import MovieDetailsPage from './Components/moviedetailspage';
import Admin from './Components/adminpage';
import Cashier from './Components/cashier';
import Profile from './Components/profile';
import Purchase from './Components/purchase';
import MovieDetails from './Components/moviedetails';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
    <div className="App">
      
      <main>

        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/cashier" element={<Cashier />} />
        </Routes>
      </main>

    </div>
    </AuthProvider>
  );
}

export default App;