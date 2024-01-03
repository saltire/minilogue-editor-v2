import { useAppSelector } from '../store';


export default function Ports() {
  const ports = useAppSelector(({ midi }) => midi.ports);

  const inputs = Object.values(ports).filter(port => port?.type === 'input');
  const outputs = Object.values(ports).filter(port => port?.type === 'output');

  return (
    <div className='ports'>
      {inputs.map(port => port && (
        <div key={port.id}>
          (INPUT) {port.name}
        </div>
      ))}

      {outputs.map(port => port && (
        <div key={port.id}>
          (OUTPUT) {port.name}
        </div>
      ))}
    </div>
  );
}
