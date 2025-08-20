import { useEffect, useRef } from 'react';

interface BarcodeGeneratorProps {
  value: string;
  width?: number;
  height?: number;
  fontSize?: number;
  displayValue?: boolean;
}

export function BarcodeGenerator({ 
  value, 
  width = 2, 
  height = 60, 
  fontSize = 12, 
  displayValue = true 
}: BarcodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!value || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple barcode generation (Code 39 style)
    const generateBarcode = (text: string) => {
      // Basic encoding pattern for demonstration
      // In production, you'd use a proper barcode library
      const patterns: Record<string, string> = {
        '0': '101001101101',
        '1': '110100101011',
        '2': '101100101011',
        '3': '110110010101',
        '4': '101001101011',
        '5': '110100110101',
        '6': '101100110101',
        '7': '101001011011',
        '8': '110100101101',
        '9': '101100101101',
        'A': '110101001011',
        'B': '101101001011',
        'C': '110110100101',
        'D': '101011001011',
        'E': '110101100101',
        'F': '101101100101',
        'G': '101010011011',
        'H': '110101001101',
        'I': '101101001101',
        'J': '101011001101',
        'K': '110101010011',
        'L': '101101010011',
        'M': '110110101001',
        'N': '101011010011',
        'O': '110101101001',
        'P': '101101101001',
        'Q': '101010110011',
        'R': '110101011001',
        'S': '101101011001',
        'T': '101011011001',
        'U': '110010101011',
        'V': '100110101011',
        'W': '110011010101',
        'X': '100101101011',
        'Y': '110010110101',
        'Z': '100110110101',
        '-': '100101011011',
        '.': '110010101101',
        ' ': '100110101101',
        '*': '100101101101' // Start/stop character
      };

      // Add start and stop characters
      let barcodePattern = patterns['*'] || '';
      
      for (const char of text.toUpperCase()) {
        barcodePattern += patterns[char] || patterns['*'];
      }
      
      barcodePattern += patterns['*'];
      
      return barcodePattern;
    };

    const pattern = generateBarcode(value);
    const barWidth = width;
    const barHeight = height;
    const totalWidth = pattern.length * barWidth;
    
    // Set canvas size
    canvas.width = totalWidth;
    canvas.height = barHeight + (displayValue ? fontSize + 10 : 0);
    
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw barcode
    ctx.fillStyle = 'black';
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] === '1') {
        ctx.fillRect(i * barWidth, 0, barWidth, barHeight);
      }
    }
    
    // Draw text if enabled
    if (displayValue) {
      ctx.fillStyle = 'black';
      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(value, totalWidth / 2, barHeight + fontSize + 5);
    }
  }, [value, width, height, fontSize, displayValue]);

  if (!value) {
    return (
      <div className="flex items-center justify-center h-20 bg-gray-100 rounded border-2 border-dashed border-gray-300">
        <span className="text-gray-500 text-sm">No barcode value</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <canvas 
        ref={canvasRef}
        className="border border-gray-300 rounded"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      {!displayValue && (
        <span className="text-xs text-gray-600 font-mono">{value}</span>
      )}
    </div>
  );
}
