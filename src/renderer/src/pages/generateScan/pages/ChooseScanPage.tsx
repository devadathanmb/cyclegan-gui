import React from 'react'
import { Button } from 'react-bootstrap'

interface ChooseScanPageProps {
  selectedTargetScanType: string
  onSelectTargetScanType: (scanType: string) => void
}

const ChooseScanPage: React.FC<ChooseScanPageProps> = ({
  selectedTargetScanType,
  onSelectTargetScanType
}) => {
  const handleScanTypeSelection = (scanType: string): void => {
    onSelectTargetScanType(scanType)
  }

  return (
    <div className="container m-3">
      <h3 className="mb-4"> Select the scan that you want to generate</h3>
      <div className="text-center">
        <Button
          variant="primary"
          size="lg"
          className="mx-2 px-5"
          active={selectedTargetScanType === 'mri'}
          onClick={() => handleScanTypeSelection('mri')}
        >
          MRI
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="mx-2 px-5"
          active={selectedTargetScanType === 'ct'}
          onClick={() => handleScanTypeSelection('ct')}
        >
          CT
        </Button>
      </div>
      {selectedTargetScanType && (
        <div className="text-center">
          <p className="mt-3 fw-bold">
            Selected scan type:{' '}
            <span className="fw-bold">{selectedTargetScanType.toUpperCase()}</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default ChooseScanPage
