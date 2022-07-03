import axios from 'axios';
import './App.css';
import { Cards } from './components/card';

function App() {
  // const { REACT_APP_DEFAULT_LOGIN, REACT_APP_DEFAULT_PASSWORD } = process.env
  // console.log(process.env)

  const login = 'letscode'
  const senha = 'lets@123'

  const listaColunas = {
    "ToDo": "To Do", 
    "Doing": "Doing", 
    "Done": "Done",
  }

  async function autenticar(){
    await axios.post('http://localhost:5000/login', {login, senha}).then(res => {
      localStorage.setItem('authorization', res.data)
    })
  }
  autenticar()
  return (
    <div className="app">
      <div>
          <Cards listaCabecalhos={Object.values(listaColunas)} listaChaves={Object.keys(listaColunas)} />
      </div>
    </div>
  );
}

export default App;
