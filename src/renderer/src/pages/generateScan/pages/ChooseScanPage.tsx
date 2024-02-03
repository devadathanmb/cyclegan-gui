import React from 'react'
import { Button } from 'react-bootstrap'

interface ChooseScanPageProps {
  selectedScanType: string
  onSelectScanType: (scanType: string) => void
}

const ChooseScanPage: React.FC<ChooseScanPageProps> = ({ selectedScanType, onSelectScanType }) => {
  const handleScanTypeSelection = (scanType: string): void => {
    onSelectScanType(scanType)
  }

  return (
    <div className="container m-3">
      <h3 className="mb-4"> Select the scan that you want to generate</h3>
      <div className="text-center">
        <Button
          variant="primary"
          size="lg"
          className="mx-2 px-5"
          active={selectedScanType === 'mri'}
          onClick={() => handleScanTypeSelection('mri')}
        >
          MRI
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="mx-2 px-5"
          active={selectedScanType === 'ct'}
          onClick={() => handleScanTypeSelection('ct')}
        >
          CT
        </Button>
      </div>
      {selectedScanType && (
        <div className="text-center">
          <p className="mt-3 fw-bold">
            Selected scan type: <span className="fw-bold">{selectedScanType.toUpperCase()}</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default ChooseScanPage
