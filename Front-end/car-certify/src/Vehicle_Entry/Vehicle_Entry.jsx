import Sidebar from './sidebar'
import MainContent from './mainContent'
import StepTwo from './StepTwo'
import StepThree from './StepThree'
import StepFour from './StepFour'
import { useState } from 'react'
function Vehicle_Entry(){
    const [currentStep, setCurrentStep] = useState(1)
    const totalsteps = 4

    const handleNext = () => {
        if (currentStep < totalsteps){
            setCurrentStep(currentStep + 1)
        }
    }

    const handleprevious = () => {
        if (currentStep > 1){
            setCurrentStep(currentStep - 1)
        }
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <MainContent/>
            case 2:
                return <StepTwo/>
            case 3:
                return <StepThree/>
            case 4:
                return <StepFour/>
        }
    }

    return(
        <>
        <div className='d-flex p-4 gap-4' style={{height: '100vh'}}>
        <Sidebar currentStep={currentStep}/>
        <div className=' flex-grow-1 w-100 overflow-auto'>
            {/* Header and Progress */}
      <div className="mb-4">
        <div className="d-flex align-items-center text-dark mb-2">
          Step {currentStep}/5
        </div>
        <div className="progress mb-2" style={{ height: '8px' }}>
          <div
            className="progress-bar bg-dark"
            role="progressbar"
            style={{ width: `${(currentStep * 30) - 20}%` }}
          ></div>
        </div>
      </div>
        <div>{renderStep()}</div>
           <div className="d-flex justify-content-between align-items-center border-top p-3 bg-white">
  
 <button
  type="button"
  className="btn btn-dark d-flex align-items-center"
  onClick={handleprevious}
  
>
  <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
  Previous
</button>  
<button
  type="button"
  className={`d-flex align-items-center btn ${
    currentStep === 4 ? 'btn-success' : 'btn-dark'
  }`}
  onClick={handleNext}
>
    Next
  <svg className="ms-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
    d="M10 5l7 7m0 0l-7 7m7-7H3" />
</svg>

  
</button>      
</div>
        </div>
        </div>
        </>
    )
}

export default Vehicle_Entry