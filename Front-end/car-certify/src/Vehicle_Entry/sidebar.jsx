import logo from '../../../Images/logo.png';
import { Check } from 'lucide-react';

function Sidebar({ currentStep, onStepChange }) {

  const STEPS = [
    { id: 1, title: 'Vehicle Basic Info', subtitle: 'Introduce the car' },
    { id: 2, title: 'Mileage & Service', subtitle: 'How far has it gone?' },
    { id: 3, title: 'Accident Report', subtitle: 'Any bruises?' },
    { id: 4, title: 'Media', subtitle: 'Photos and images' },
  ];

  return (
    <div
      className="d-flex flex-column p-3 bg-white border-end rounded rounded-4"
      style={{ width: '250px', minHeight: '100vh' }}
    >
      {/* Logo */}
      <a href='/' className=' text-decoration-none'>
         <div className="mb-4 text-center">
        <img src={logo} alt="Logo" className="img-fluid mb-2" />
        <p className="small text-muted mb-0">Vehicle Entry Portal</p>
      </div>
      </a>

      {/* Header */}
      <div className="mb-4">
        <p className="small text-muted mb-0">
          Complete these 5 simple steps to list your vehicle.
        </p>
      </div>

      {/* Steps Navigation */}
      <nav className="nav flex-column">
        {STEPS.map((step) => (
          <button
            key={step.id}
            onClick={() => onStepChange(step.id)}
            className="d-flex align-items-start mb-3 bg-transparent border-0 text-start p-0 w-100"
            style={{ cursor: 'pointer' }}
          >
            {/* Circle */}
            <div
              className="d-flex justify-content-center align-items-center rounded-circle fw-bold me-2"
              style={{
                width: '32px',
                height: '32px',
                fontSize: '0.85rem',
                backgroundColor:
                  step.id === currentStep
                    ? '#000'
                    : step.id < currentStep
                    ? '#d1fae5'
                    : '#e9ecef',
                color:
                  step.id === currentStep
                    ? '#fff'
                    : step.id < currentStep
                    ? '#065f46'
                    : '#6c757d',
              }}
            >
              {step.id < currentStep ? <Check size={16} /> : step.id}
            </div>

            {/* Labels */}
            <div>
              <p
                className={`mb-0 ${
                  step.id === currentStep
                    ? 'fw-semibold text-dark'
                    : 'text-secondary'
                }`}
              >
                {step.title}
              </p>
              <small className="text-muted">{step.subtitle}</small>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
