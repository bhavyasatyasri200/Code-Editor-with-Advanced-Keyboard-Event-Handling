export const getIndentation = (line) => {
    const match = line.match(/^(\s*)/);
    return match ? match[1] : '';
  };
  
  export const toggleComment = (text, selectionStart, selectionEnd) => {
    const lines = text.split('\n');
    const startLine = text.substring(0, selectionStart).split('\n').length - 1;
    const endLine = text.substring(0, selectionEnd).split('\n').length - 1;
    
    let newText = '';
    let offset = 0;
    
    for (let i = 0; i < lines.length; i++) {
      if (i >= startLine && i <= endLine) {
        if (lines[i].startsWith('// ')) {
          lines[i] = lines[i].substring(3);
          if (i === startLine) offset = -3;
        } else if (lines[i].startsWith('//')) {
          lines[i] = lines[i].substring(2);
          if (i === startLine) offset = -2;
        } else {
          lines[i] = '// ' + lines[i];
          if (i === startLine) offset = 3;
        }
      }
    }
    
    newText = lines.join('\n');
    
    return {
      text: newText,
      selectionStart: selectionStart + offset,
      selectionEnd: selectionEnd + offset
    };
  };
  
  export const addIndentation = (text, selectionStart) => {
    const beforeCursor = text.substring(0, selectionStart);
    const afterCursor = text.substring(selectionStart);
    const lines = beforeCursor.split('\n');
    const currentLineIndex = lines.length - 1;
    
    lines[currentLineIndex] = '  ' + lines[currentLineIndex];
    
    const newText = lines.join('\n') + afterCursor;
    const newSelectionStart = selectionStart + 2;
    
    return {
      text: newText,
      selectionStart: newSelectionStart
    };
  };
  
  export const removeIndentation = (text, selectionStart) => {
    const beforeCursor = text.substring(0, selectionStart);
    const afterCursor = text.substring(selectionStart);
    const lines = beforeCursor.split('\n');
    const currentLineIndex = lines.length - 1;
    
    if (lines[currentLineIndex].startsWith('  ')) {
      lines[currentLineIndex] = lines[currentLineIndex].substring(2);
      const newText = lines.join('\n') + afterCursor;
      const newSelectionStart = selectionStart - 2;
      
      return {
        text: newText,
        selectionStart: newSelectionStart
      };
    }
    
    return {
      text,
      selectionStart
    };
  };
  