import React, { useState, useRef, useEffect } from "react";
import {
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Check,
  X,
  Move,
} from "lucide-react";

const ImageCropModal = ({
  isOpen,
  imageFile,
  onConfirm,
  onCancel,
  aspectRatio = 1,
  cropShape = "rect",
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (imageFile && isOpen) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          imageRef.current = img;
          setImageSrc(e.target.result);
          setCrop({ x: 0, y: 0 });
          setZoom(1);
          setRotation(0);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile, isOpen]);

  useEffect(() => {
    if (!imageSrc || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imageRef.current;

    const containerWidth = containerRef.current?.offsetWidth || 300;
    const size = Math.min(containerWidth - 30, 300);
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);
    ctx.save();

    const scale = Math.min(size / img.width, size / img.height) * zoom;
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    const centerX = size / 2;
    const centerY = size / 2;

    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    ctx.drawImage(
      img,
      centerX - scaledWidth / 2 + crop.x,
      centerY - scaledHeight / 2 + crop.y,
      scaledWidth,
      scaledHeight
    );

    ctx.restore();
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";

    const cropSize = size * 0.7;
    const cropX = (size - cropSize) / 2;
    const cropY = (size - cropSize) / 2;

    ctx.fillRect(0, 0, size, cropY);
    ctx.fillRect(0, cropY, cropX, cropSize);
    ctx.fillRect(cropX + cropSize, cropY, size - cropX - cropSize, cropSize);
    ctx.fillRect(0, cropY + cropSize, size, size - cropY - cropSize);

    ctx.strokeStyle = "#14b8a6";
    ctx.lineWidth = 2;

    if (cropShape === "round") {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, cropSize / 2, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.strokeRect(cropX, cropY, cropSize, cropSize);
    }

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
  }, [imageSrc, crop, zoom, rotation, cropShape]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - crop.x, y: e.clientY - crop.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setCrop({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleTouchStart = (e) => {
    const t = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: t.clientX - crop.x, y: t.clientY - crop.y });
  };
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const t = e.touches[0];
    setCrop({
      x: t.clientX - dragStart.x,
      y: t.clientY - dragStart.y,
    });
  };
  const handleTouchEnd = () => setIsDragging(false);
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const getCroppedImage = () => {
    if (!imageRef.current || !canvasRef.current) return null;
    const canvas = canvasRef.current;
    const img = imageRef.current;
    const size = canvas.width;
    const cropSize = size * 0.7;
    const cropCanvas = document.createElement("canvas");
    const cropCtx = cropCanvas.getContext("2d");
    const outputSize = 512;
    cropCanvas.width = outputSize;
    cropCanvas.height = outputSize;
    const scale = Math.min(size / img.width, size / img.height) * zoom;
    const centerX = size / 2;
    const centerY = size / 2;
    const cropX = (size - cropSize) / 2;
    const cropY = (size - cropSize) / 2;
    const sourceX = (cropX - centerX - crop.x) / scale + img.width / 2;
    const sourceY = (cropY - centerY - crop.y) / scale + img.height / 2;
    const sourceSize = cropSize / scale;
    if (rotation !== 0) {
      cropCtx.save();
      cropCtx.translate(outputSize / 2, outputSize / 2);
      cropCtx.rotate((rotation * Math.PI) / 180);
      cropCtx.translate(-outputSize / 2, -outputSize / 2);
    }
    cropCtx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      outputSize,
      outputSize
    );
    if (rotation !== 0) cropCtx.restore();
    if (cropShape === "round") {
      cropCtx.globalCompositeOperation = "destination-in";
      cropCtx.beginPath();
      cropCtx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
      cropCtx.fill();
    }
    return cropCanvas;
  };

  const handleConfirm = () => {
    const croppedCanvas = getCroppedImage();
    if (!croppedCanvas) return;
    croppedCanvas.toBlob((blob) => {
      const croppedFile = new File([blob], imageFile.name, {
        type: imageFile.type,
      });
      onConfirm(croppedFile);
    }, imageFile.type);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm sm:max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center">
            <Crop className="w-4 h-4 mr-2 text-teal-600" />
            Crop Image
          </h2>
          <button
            onClick={onCancel}
            className="p-1.5 hover:bg-slate-100 rounded-full"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Canvas */}
        <div className="p-4" ref={containerRef}>
          <div
            className="relative bg-slate-900 rounded-md overflow-hidden"
            style={{ touchAction: "none" }}
          >
            <canvas
              ref={canvasRef}
              className="w-full cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
            <div className="absolute top-2 left-2 bg-black/40 text-white px-2 py-1 rounded-md text-xs flex items-center">
              <Move className="w-3 h-3 mr-1" /> Drag to position
            </div>
          </div>

          {/* Controls */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm w-12 text-slate-700">Zoom</span>
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className="p-1.5 hover:bg-slate-100 rounded-md"
              >
                <ZoomOut className="w-4 h-4 text-slate-600" />
              </button>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <button
                onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                className="p-1.5 hover:bg-slate-100 rounded-md"
              >
                <ZoomIn className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm w-12 text-slate-700">Rotate</span>
              <button
                onClick={handleRotate}
                className="flex items-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-md text-xs"
              >
                <RotateCw className="w-3 h-3 mr-1" />
                90°
              </button>
              <span className="text-xs text-slate-600">{rotation}°</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 border border-slate-300 rounded-md text-sm hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-sm flex items-center"
          >
            <Check className="w-3.5 h-3.5 mr-1" />
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
