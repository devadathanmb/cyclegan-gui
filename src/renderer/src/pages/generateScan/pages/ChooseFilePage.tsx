import React, { useState } from 'react'
import { Col } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Image from 'react-bootstrap/Image'
import { toast } from 'react-toastify'

interface ChooseFilePageProps {
  selectedTargetScanType: string
  onSelectFilePath: (filePath: string) => void
}

const ChooseFilePage: React.FC<ChooseFilePageProps> = ({
  selectedTargetScanType,
  onSelectFilePath
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const targetScanType = selectedTargetScanType.toUpperCase() === 'CT' ? 'MRI' : 'CT'

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const fileList = event.target.files!
    if (fileList[0].type.split('/')[0] !== 'image') {
      toast.error('Invalid file type. Please choose an image file')
      setSelectedFile(null)
      onSelectFilePath('')
      return
    }
    setSelectedFile(fileList![0])
    onSelectFilePath(fileList![0].path)
  }

  return (
    <div className="container mt-3 text-center">
      <h3 className="mb-4">Choose {targetScanType}</h3>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Please choose the {targetScanType} scan</Form.Label>
        <Form.Control type="file" onChange={handleFileChange} />
      </Form.Group>{' '}
      {selectedFile && (
        <div className="">
          <p className="mt-3">Selected File: {selectedFile.name}</p>
          <Col className="mx-auto" md={5}>
            <Image
              src={`file://${selectedFile.path}`}
              alt="Preview image"
              className="img-thumbnail mx-auto"
            />
          </Col>
        </div>
      )}
    </div>
  )
}

export default ChooseFilePage
