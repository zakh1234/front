import React from 'react';
import gradeImage from '../grade.jpg'; // Adjust the path as necessary

const Terms = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <img src={gradeImage} alt="Grade" className="max-w-full max-h-full" />
    </div>
  );
};

export default Terms;
