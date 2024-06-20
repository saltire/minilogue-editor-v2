import { useAppDispatch, useAppSelector } from '../store';
import { setOutputId } from '../slices/midiSlice';


export default function Ports() {
  const dispatch = useAppDispatch();
  const inputs = useAppSelector(({ midi }) => midi.inputs);
  const outputs = useAppSelector(({ midi }) => midi.outputs);
  const outputId = useAppSelector(({ midi }) => midi.outputId);

  return (
    <div className='ports'>
      {Object.values(inputs).map(port => port && (
        <div key={port.id}>
          (INPUT) {port.name}
        </div>
      ))}

      {Object.values(outputs).map(port => port && (
        <div key={port.id}>
          <input
            type='radio'
            checked={outputId === port.id}
            onChange={() => dispatch(setOutputId(port.id))}
          />
          {} (OUTPUT) {port.name}
        </div>
      ))}
    </div>
  );
}
