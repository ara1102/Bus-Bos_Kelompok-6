import { useEffect, useRef } from 'react';

interface MaskingPageProps {
  photoPaths: string[];
  canvasWidth: number;
  canvasHeight: number;
}

const MaskingPage: React.FC<MaskingPageProps> = ({ photoPaths, canvasWidth, canvasHeight }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const images = photoPaths.map((filePath) => {
      const image = new Image();
      image.src = filePath;
      return { image };
    });

    let loadedCount = 0;
    const onLoad = () => {
      loadedCount++;
      if (loadedCount === images.length) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        images.forEach(({ image }) => {
          ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
        });
      }
    };

    images.forEach(({ image }) => {
      image.onload = onLoad;
    });
  }, [photoPaths, canvasWidth, canvasHeight]);

  return (
    <div>
      <h1>Picture Masking</h1>
      <canvas ref={canvasRef} className='bg-red-500' />
    </div>
  );
};

export default MaskingPage;

// import { useEffect, useRef, useState } from 'react';

// const MaskingPage: React.FC = () => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [selectedImages, setSelectedImages] = useState<string[]>([]);
//   const canvasSize = { width: 800, height: 500 }; // Set the desired canvas size

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     const images = selectedImages.map((filePath) => {
//       const image = new Image();
//       image.src = filePath;
//       return { image };
//     });

//     let loadedCount = 0;
//     const onLoad = () => {
//       loadedCount++;
//       if (loadedCount === images.length) {
//         canvas.width = canvasSize.width;
//         canvas.height = canvasSize.height;

//         images.forEach(({ image }) => {
//           ctx.drawImage(image, 0, 0, canvasSize.width, canvasSize.height);
//         });
//       }
//     };

//     images.forEach(({ image }) => {
//       image.onload = onLoad;
//     });
//   }, [selectedImages, canvasSize]);

//   useEffect(() => {
//     // Simulating data received from the backend
//     const backendData = ['/next.svg', '/Frame 9.png'];
//     setSelectedImages(backendData);
//   }, []);

//   return (
//     <div>
//       <h1>Picture Masking</h1>
//       <canvas ref={canvasRef} className='bg-red-500' />
//     </div>
//   );
// };

// export default MaskingPage;

// import { useEffect, useRef, useState } from 'react';
// import { createCanvas, loadImage } from 'canvas';
// import base64Img from 'base64-img';

// const MaskingPage: React.FC = () => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [selectedImages, setSelectedImages] = useState<string[]>([]);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     const images = selectedImages.map((filePath) => {
//       const image = new Image();
//       image.src = filePath;
//       return { image };
//     });

//     let loadedCount = 0;
//     const onLoad = () => {
//       loadedCount++;
//       if (loadedCount === images.length) {
//         canvas.width = Math.max(...images.map(({ image }) => image.width));
//         canvas.height = Math.max(...images.map(({ image }) => image.height));

//         images.forEach(({ image }) => {
//           ctx.drawImage(image, 0, 0);
//         });
//       }
//     };

//     images.forEach(({ image }) => {
//       image.onload = onLoad;
//     });
//   }, [selectedImages]);

//   useEffect(() => {
//     // Simulating data received from the backend
//     const backendData = ['/next.svg','/Frame 9.png' ];
//     setSelectedImages(backendData);
//   }, []);

//   return (
//     <div>
//       <h1>Picture Masking</h1>
//       <canvas ref={canvasRef} className='bg-red-500'/>
//     </div>
//   );
// };

// export default MaskingPage;
