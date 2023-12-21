import './Panel.css';
import Knob from './Knob';


export default function Panel() {
  return (
    <div className='Panel'>
      <header>
        <h1 className='program-title'>
          Program
        </h1>
      </header>

      <div className='panel-controls'>
        <div className='panel-section'>
          <div className='control-group'>
            <div className='control-wrapper'>
              <Knob value={1023} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
