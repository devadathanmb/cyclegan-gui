import { Image, Col, Row } from 'react-bootstrap'
import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useNavigate } from 'react-router-dom'

interface ShowGeneratedScanPageProps {
  selectedScanType: string
  selectedFilePath: string
}

const ShowGeneratedScanPage: React.FC<ShowGeneratedScanPageProps> = ({
  selectedScanType,
  selectedFilePath
}) => {
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState<boolean>(true)
  const [targetFilePath, setTargetFilePath] = React.useState<string>('')

  React.useEffect(() => {
    const generateScan = async (): Promise<void> => {
      try {
        //@ts-ignore asdf
        const generatedScanPath = await window.api.generateScan(selectedScanType, selectedFilePath)
        console.log(generatedScanPath)
        setTargetFilePath(generatedScanPath)
        setLoading(false)
      } catch (error) {
        console.error('Error generating scan:', error)
        navigate('/')
      }
    }
    generateScan()
    /**/
    /* setTimeout(() => { */
    /*   setLoading(false) */
    /*   setTargetFilePath(selectedFilePath) */
    /* }, 50000) */
  }, [selectedScanType, selectedFilePath])

  return (
    <div className="container m-3">
      <h3 className="mb-4 text-center">Generated results</h3>
      <Row>
        <Col className="mx-auto">
          <Image
            src={`file://${selectedFilePath}`}
            alt="Preview"
            className="img-thumbnail mx-auto"
          />
        </Col>
        <Col className="mx-auto">
          {loading ? (
            <div className="img-thumbnail h-100">
              <Skeleton
                baseColor="#2d3e50"
                highlightColor="#1a1a2e"
                className="react-loading-skeleton"
                height="100%"
              />
            </div>
          ) : (
            <div>
              <Image
                src={`file://${targetFilePath}`}
                alt="Preview"
                className="img-thumbnail mx-auto"
              />
            </div>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <p className="text-center mt-3">
            {selectedScanType.toUpperCase() === 'MRI' ? 'CT' : 'MRI'}
          </p>
        </Col>
        <Col>
          {loading ? (
            <p className="text-center mt-3">Loading...</p>
          ) : (
            <p className="text-center mt-3">{selectedScanType.toUpperCase()}</p>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default ShowGeneratedScanPage
