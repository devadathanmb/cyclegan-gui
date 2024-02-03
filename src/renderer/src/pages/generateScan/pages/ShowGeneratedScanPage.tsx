import { Image, Col, Row } from 'react-bootstrap'
import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface ShowGeneratedScanPageProps {
  selectedScanType: string
  selectedFilePath: string
}

const ShowGeneratedScanPage: React.FC<ShowGeneratedScanPageProps> = ({
  selectedScanType,
  selectedFilePath
}) => {
  const [loading, setLoading] = React.useState<boolean>(true)

  // Simulate an asynchronous operation (e.g., loading image data)
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 500) // Simulating a 2-second delay (adjust as needed)

    return () => clearTimeout(timeout)
  }, []) // Run once on component mount

  return (
    <div className="container m-3">
      <h3 className="mb-4 text-center">Generated results</h3>
      <Row>
        <Col md={5} className="mx-auto">
          <Image
            src={`file://${selectedFilePath}`}
            alt="Preview"
            className="img-thumbnail mx-auto"
          />
        </Col>
        <Col md={5} className="mx-auto">
          {loading ? (
            <div className="img-thumbnail h-100">
              <Skeleton
                baseColor="#2d3e50" // Base color corresponding to the darker blue in the gradient
                highlightColor="#1a1a2e" // Highlight color corresponding to the deep navy blue in the gradient
                className="react-loading-skeleton"
                height="100%"
              />{' '}
            </div>
          ) : (
            <div>
              <Image
                src={`file://${selectedFilePath}`}
                alt="Preview"
                className="img-thumbnail mx-auto"
              />
            </div>
          )}
        </Col>
      </Row>
      {/* This is a hack */}
      <Row>
        <Col>
          <p className="text-center mt-3">
            {selectedScanType.toUpperCase() === 'MRI' ? 'CT' : 'MRI'}
          </p>
        </Col>
        <Col>
          {loading ? (
            <p className="text-center mt-3">Loading..</p>
          ) : (
            <p className="text-center mt-3">{selectedScanType.toUpperCase()}</p>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default ShowGeneratedScanPage
