import React, { useState, useEffect } from 'react';

export default function TypewriterEffect({ result }) {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
    //   if (index < result.length) {
    //     setDisplayText(prevText => prevText + result[index]);
    //     setIndex(prevIndex => prevIndex + 1);
    //   } else {
    //     clearInterval(interval);
    //   }
     setIndex(1);
    setDisplayText(result);
    }, 50); // Adjust typing speed as needed (milliseconds)
    
    return () => clearInterval(interval);
  }, [result, index]);

  return (
      <p style={{textAlign:"center", width:"100%"}}>Result : {displayText}</p>
   
  );
}
