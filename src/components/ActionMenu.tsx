import './ActionMenu.css';
import NewIcon from '../assets/new.svg';
import { INIT_PROGRAM } from '../minilogue/program';
import { setCurrentProgram } from '../slices/programSlice';
import { useAppDispatch } from '../store';
import Button from './Button';


export default function ActionMenu() {
  const dispatch = useAppDispatch();

  return (
    <ul className='action-menu'>
      <li>
        <Button title='Init Program' onClick={() => dispatch(setCurrentProgram(INIT_PROGRAM))}>
          <NewIcon />
        </Button>
      </li>
    </ul>
  );
}
