import './App.css';
import MessageLog from './components/MessageLog';
import Panel from './components/Panel';
import Ports from './components/Ports';


export default function App() {
  return (
    <div className='App'>
      <Panel />

      <div className='status'>
        <Ports />
        <MessageLog />
      </div>
    </div>
  );
}
