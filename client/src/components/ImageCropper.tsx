import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import getCroppedImg from '../utils/cropImage'

interface ImageCropperProps {
    imageSrc: string;
    onCropComplete: (croppedImage: Blob) => void;
    onCancel: () => void;
}

const ImageCropper = ({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop)
    }

    const onZoomChange = (zoom: number) => {
        setZoom(zoom)
    }

    const onCropCompleteHandler = useCallback((_: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(
                imageSrc,
                croppedAreaPixels
            )
            if (croppedImage) {
                onCropComplete(croppedImage)
            }
        } catch (e) {
            console.error(e)
        }
    }, [imageSrc, croppedAreaPixels, onCropComplete])

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                position: 'relative',
                width: '90%',
                height: '70%',
                backgroundColor: '#333',
                borderRadius: '8px',
                overflow: 'hidden'
            }}>
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={onCropChange}
                    onCropComplete={onCropCompleteHandler}
                    onZoomChange={onZoomChange}
                />
            </div>
            <div style={{
                marginTop: '1rem',
                display: 'flex',
                gap: '1rem',
                width: '90%',
                justifyContent: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                    <span>Zoom</span>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => setZoom(Number(e.target.value))}
                        style={{ width: '200px' }}
                    />
                </div>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <button
                    onClick={onCancel}
                    style={{
                        padding: '0.5rem 1.5rem',
                        borderRadius: '4px',
                        border: '1px solid white',
                        background: 'transparent',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                >
                    Cancel
                </button>
                <button
                    onClick={showCroppedImage}
                    style={{
                        padding: '0.5rem 1.5rem',
                        borderRadius: '4px',
                        border: 'none',
                        background: 'var(--primary, #007bff)',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                >
                    Crop & Upload
                </button>
            </div>
        </div>
    )
}

export default ImageCropper
