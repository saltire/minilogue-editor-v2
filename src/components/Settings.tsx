import './Settings.css';
import { useAppDispatch, useAppSelector } from '../store';
import { setChannel } from '../slices/midiSlice';


export default function Settings() {
  const dispatch = useAppDispatch();
  const channel = useAppSelector(({ midi }) => midi.channel);

  return (
    <div className='Settings'>
      <h3>Settings</h3>

      <label>
        <span>Channel</span>
        <input
          type='number'
          min={1}
          max={16}
          value={channel + 1}
          onChange={e => dispatch(setChannel((parseInt(e.target.value) || 1) - 1))}
        />
      </label>
    </div>
  );
}
