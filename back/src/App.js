import './App.css';
import Routes from './routes/routes'
import {Provider} from 'react-redux'
import store from './redux/index'
import 'react-datepicker/dist/react-datepicker';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Routes/>
      </div>
    </Provider>
  );
}

export default App;
