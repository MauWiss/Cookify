import React, { useState } from 'react';

const ResizableTable = () => {
  const [width, setWidth] = useState('100%');

  const handleClick = () => {
    setWidth('50%');
  };

  const handleDoubleClick = () => {
    setWidth('100%');
  };

  return (
    <table
      style={{
        width: width,
        border: '1px solid black', // Adds border around the table
        borderCollapse: 'collapse', // Ensures borders between cells are shared
        textAlign: 'center',
        transition: 'width 0.3s ease',
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <tbody>
        <tr>
          <td style={{ border: '1px solid black' }}>Row 1, Col 1</td>
          <td style={{ border: '1px solid black' }}>Row 1, Col 2</td>
          <td style={{ border: '1px solid black' }}>Row 1, Col 3</td>
        </tr>
        <tr>
          <td style={{ border: '1px solid black' }}>Row 2, Col 1</td>
          <td style={{ border: '1px solid black' }}>Row 2, Col 2</td>
          <td style={{ border: '1px solid black' }}>Row 2, Col 3</td>
        </tr>
      </tbody>
    </table>
  );
};

export default ResizableTable;
