import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Camera, Keyboard, Search } from 'lucide-react';

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

export function BarcodeScanner({ isOpen, onClose, onScan }: BarcodeScannerProps) {
  const [manualInput, setManualInput] = useState('');
  const [scanMode, setScanMode] = useState<'manual' | 'camera'>('manual');

  const handleManualScan = () => {
    if (manualInput.trim()) {
      onScan(manualInput.trim());
      setManualInput('');
      onClose();
    }
  };

  const handleCameraScan = () => {
    // In a real implementation, this would access the camera
    // For now, we'll show a message about camera functionality
    alert('Camera scanning would be implemented here. For demo purposes, please use manual input.');
    setScanMode('manual');
  };

  const handleClose = () => {
    setManualInput('');
    setScanMode('manual');
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleManualScan();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Barcode Scanner</span>
          </DialogTitle>
          <DialogDescription>
            Scan a pallet or location barcode to find and manage items.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Scan Mode Selection */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={scanMode === 'manual' ? 'default' : 'outline'}
              onClick={() => setScanMode('manual')}
              className="flex items-center space-x-2"
            >
              <Keyboard className="h-4 w-4" />
              <span>Manual Input</span>
            </Button>
            <Button
              variant={scanMode === 'camera' ? 'default' : 'outline'}
              onClick={() => setScanMode('camera')}
              className="flex items-center space-x-2"
            >
              <Camera className="h-4 w-4" />
              <span>Camera Scan</span>
            </Button>
          </div>

          {/* Manual Input Mode */}
          {scanMode === 'manual' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Barcode Manually
                </label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type or paste barcode here"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                    autoFocus
                  />
                  <Button 
                    onClick={handleManualScan} 
                    disabled={!manualInput.trim()}
                  >
                    Scan
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter the barcode value exactly as it appears
                </p>
              </div>

              {/* Common Barcodes Quick Access */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Access (Demo)
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setManualInput('PAL-PL-123456')}
                    className="justify-start text-left"
                  >
                    <span className="font-mono text-xs">PAL-PL-123456</span>
                    <span className="ml-2 text-gray-500">(Sample Pallet)</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setManualInput('LOC-A-01-15')}
                    className="justify-start text-left"
                  >
                    <span className="font-mono text-xs">LOC-A-01-15</span>
                    <span className="ml-2 text-gray-500">(Sample Location)</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Camera Mode */}
          {scanMode === 'camera' && (
            <div className="space-y-4">
              <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Camera Scanning
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Camera access would be implemented here using WebRTC APIs or a barcode scanning library like ZXing.
                </p>
                <Button onClick={handleCameraScan} className="mb-2">
                  Start Camera Scan
                </Button>
                <p className="text-xs text-gray-500">
                  For security reasons, camera access requires HTTPS in production
                </p>
              </div>
              
              <div className="text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setScanMode('manual')}
                  className="text-sm"
                >
                  Switch to Manual Input
                </Button>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              Scanning Tips:
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Pallet barcodes start with "PAL-"</li>
              <li>• Location barcodes start with "LOC-"</li>
              <li>• Ensure barcode is clean and well-lit</li>
              <li>• Hold device steady during scanning</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
