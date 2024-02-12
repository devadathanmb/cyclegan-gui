import { Image, Col, Row } from 'react-bootstrap'
import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

interface ShowGeneratedScanPageProps {
  selectedTargetScanType: string
  selectedFilePath: string
}

const ShowGeneratedScanPage: React.FC<ShowGeneratedScanPageProps> = ({
  selectedTargetScanType,
  selectedFilePath
}) => {
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState<boolean>(true)
  const [targetFilePath, setTargetFilePath] = React.useState<string>('')
  const srcScanType = selectedTargetScanType.toUpperCase() === 'CT' ? 'MRI' : 'CT'

  const handleOpenImageClick = async (scanType: string): Promise<void> => {
    if (scanType === srcScanType) {
      // @ts-ignore asdf
      await window.api.openImage(selectedFilePath)
    } else {
      if (loading) {
        toast.error('Please wait for the scan to be generated')
        return
      }
      // @ts-ignore asdf
      await window.api.openImage(targetFilePath)
    }
  }

  React.useEffect(() => {
    const generateScan = async (): Promise<void> => {
      try {
        //@ts-ignore asdf
        const generatedScanPath = await window.api.generateScan(
          selectedTargetScanType,
          selectedFilePath
        )
        setTargetFilePath(generatedScanPath)
        setLoading(false)
        toast.success('Scan generated and saved successfully!')
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
  }, [selectedTargetScanType, selectedFilePath])

  return (
    <div className="container m-3">
      <h3 className="mb-4 text-center">{loading ? 'Generating results..' : 'Generated results'}</h3>
      <Row>
        <Col className="mx-auto">
          <Image
            onClick={() => handleOpenImageClick(srcScanType)}
            src={`file://${selectedFilePath}`}
            alt="Preview"
            className="img-thumbnail preview-img mx-auto"
          />
        </Col>
        <Col className="mx-auto">
          {loading ? (
            <div className="img-thumbnail preview-img h-100">
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
                onClick={() => handleOpenImageClick(selectedTargetScanType)}
                src={`file://${targetFilePath}`}
                alt="Preview"
                className="img-thumbnail preview-img mx-auto"
              />
            </div>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <p className="text-center mt-3">
            {selectedTargetScanType.toUpperCase() === 'MRI' ? 'CT' : 'MRI'}
          </p>
        </Col>
        <Col>
          {loading ? (
            <p className="text-center mt-3">Loading...</p>
          ) : (
            <p className="text-center mt-3">{selectedTargetScanType.toUpperCase()}</p>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default ShowGeneratedScanPage
