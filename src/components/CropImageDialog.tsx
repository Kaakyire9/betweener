import React, { useState } from "react";
import Cropper from "react-easy-crop";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";

// Utility to crop image using canvas
async function getCroppedImg(imageSrc: string, crop: any): Promise<string> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });
  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );
  return canvas.toDataURL("image/jpeg");
}

export type CropImageDialogProps = {
  open: boolean;
  image: string | null;
  onClose: () => void;
  onCropComplete: (croppedDataUrl: string) => void;
};

export default function CropImageDialog({ open, image, onClose, onCropComplete }: CropImageDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const handleCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCrop = async () => {
    if (!image || !croppedAreaPixels) return;
    const cropped = await getCroppedImg(image, croppedAreaPixels);
    onCropComplete(cropped);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Crop Profile Picture</DialogTitle>
      <DialogContent>
        <div style={{ position: "relative", width: "100%", height: 300, background: "#222" }}>
          {image && (
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
              cropShape="round"
              showGrid={false}
            />
          )}
        </div>
        <div className="mt-4">
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(_, value) => setZoom(value as number)}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleCrop} color="primary" variant="contained">Crop</Button>
      </DialogActions>
    </Dialog>
  );
}
