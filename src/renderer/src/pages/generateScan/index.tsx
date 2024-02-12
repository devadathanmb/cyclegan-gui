import React, { useState } from 'react'
import ChooseScanPage from './pages/ChooseScanPage'
import ChooseFilePage from './pages/ChooseFilePage'
import { Link } from 'react-router-dom'
import ShowGeneratedScanPage from './pages/ShowGeneratedScanPage'
import { toast } from 'react-toastify'
import { Button } from 'react-bootstrap'

const GeneraScanWizard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [selectedTargetScanType, setSelectedTargetScanType] = useState<string>('')
  const [selectedFilePath, setSelectedFilePath] = useState<string>('')

  const nextPage = (): void => {
    if (currentPage === 0 && !selectedTargetScanType) {
      toast.error('Please select a scan type')
      return
    }
    if (currentPage === 1 && !selectedFilePath) {
      toast.error('Please select a file')
      return
    }
    // After choosing file, clicking on next should render the final page
    // and trigger the scan generation process asynchronusly
    // a skelton image should be shown in the final page
    if (currentPage === 1) {
      // do nothing for now
    }
    setCurrentPage(currentPage + 1)
  }

  const previousPage = (): void => {
    setCurrentPage(currentPage - 1)
  }

  const renderPage: React.FC = () => {
    switch (currentPage) {
      case 0:
        return (
          <ChooseScanPage
            selectedTargetScanType={selectedTargetScanType}
            onSelectTargetScanType={setSelectedTargetScanType}
          />
        )
      case 1:
        return (
          <ChooseFilePage
            selectedTargetScanType={selectedTargetScanType}
            onSelectFilePath={setSelectedFilePath}
          />
        )
      case 2:
        return (
          <ShowGeneratedScanPage
            selectedTargetScanType={selectedTargetScanType}
            selectedFilePath={selectedFilePath}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="background-container d-flex align-items-center justify-content-center vh-100">
      <div className="wizard-container">
        <div className="wizard-box p-4 border border-4 rounded">{renderPage({})}</div>
        <div className="wizard-buttons d-flex justify-content-center align-items-center mt-3">
          {currentPage > 0 && currentPage != 2 && (
            <Button size="lg" variant="info" className="mx-4" onClick={previousPage}>
              Previous
            </Button>
          )}
          {currentPage < 2 && (
            <Button size="lg" variant="warning" className="mx-4" onClick={nextPage}>
              Next
            </Button>
          )}
          {currentPage === 2 && (
            <Link to="/">
              <Button size="lg" variant="primary" className="mx-2" onClick={nextPage}>
                Go to home
              </Button>
            </Link>
          )}
        </div>
      </div>{' '}
    </div>
  )
}

export default GeneraScanWizard
