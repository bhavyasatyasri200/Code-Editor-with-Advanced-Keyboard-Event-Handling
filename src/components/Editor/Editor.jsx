import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useUndoRedo } from '../../hooks/useUndoRedo';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useDebounce } from '../../hooks/useDebounce';
import { getEventDetails } from '../../utils/keyboardUtils';
import { toggleComment, addIndentation, removeIndentation, getIndentation } from '../../utils/textUtils';
import './Editor.css';

const Editor = ({ onEvent }) => {
  const textareaRef = useRef(null);
  const [highlightCallCount, setHighlightCallCount] = useState(0);
  const { state: content, setState: setContent, pushToHistory, undo, redo, getState } = useUndoRedo('');
  
  // Debounced syntax highlighting function
  const debouncedHighlight = useDebounce(() => {
    setHighlightCallCount(prev => prev + 1);
    // Placeholder for syntax highlighting logic
    console.log('Syntax highlighting executed');
  }, 150);
  
  const handleSave = useCallback(() => {
    onEvent?.({ type: 'action', displayText: 'Action: Save' });
  }, [onEvent]);
  
  const handleUndo = useCallback(() => {
    const newContent = undo();
    if (textareaRef.current) {
      textareaRef.current.value = newContent;
    }
  }, [undo]);
  
  const handleRedo = useCallback(() => {
    const newContent = redo();
    if (textareaRef.current) {
      textareaRef.current.value = newContent;
    }
  }, [redo]);
  
  const handleToggleComment = useCallback(() => {
    if (textareaRef.current) {
      const { value, selectionStart, selectionEnd } = textareaRef.current;
      const result = toggleComment(value, selectionStart, selectionEnd);
      
      pushToHistory(value);
      setContent(result.text);
      textareaRef.current.value = result.text;
      
      // Restore cursor position
      setTimeout(() => {
        textareaRef.current.setSelectionRange(result.selectionStart, result.selectionEnd);
      }, 0);
    }
  }, [pushToHistory, setContent]);
  
  const handleIndent = useCallback(() => {
    if (textareaRef.current) {
      const { value, selectionStart } = textareaRef.current;
      const result = addIndentation(value, selectionStart);
      
      pushToHistory(value);
      setContent(result.text);
      textareaRef.current.value = result.text;
      
      setTimeout(() => {
        textareaRef.current.setSelectionRange(result.selectionStart, result.selectionStart);
      }, 0);
    }
  }, [pushToHistory, setContent]);
  
  const handleOutdent = useCallback(() => {
    if (textareaRef.current) {
      const { value, selectionStart } = textareaRef.current;
      const result = removeIndentation(value, selectionStart);
      
      pushToHistory(value);
      setContent(result.text);
      textareaRef.current.value = result.text;
      
      setTimeout(() => {
        textareaRef.current.setSelectionRange(result.selectionStart, result.selectionStart);
      }, 0);
    }
  }, [pushToHistory, setContent]);
  
  const handleEnter = useCallback((event) => {
    if (textareaRef.current) {
      const { value, selectionStart } = textareaRef.current;
      const lines = value.substring(0, selectionStart).split('\n');
      const currentLine = lines[lines.length - 1];
      const indentation = getIndentation(currentLine);
      
      if (indentation) {
        event.preventDefault();
        const beforeCursor = value.substring(0, selectionStart);
        const afterCursor = value.substring(selectionStart);
        const newValue = beforeCursor + '\n' + indentation + afterCursor;
        
        pushToHistory(value);
        setContent(newValue);
        textareaRef.current.value = newValue;
        
        const newCursorPosition = selectionStart + 1 + indentation.length;
        setTimeout(() => {
          textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
        }, 0);
      }
    }
  }, [pushToHistory, setContent]);
  
  const handleChord = useCallback(() => {
    onEvent?.({ type: 'action', displayText: 'Action: Chord Success' });
  }, [onEvent]);
  
  const { handleKeyDown } = useKeyboardShortcuts({
    onSave: handleSave,
    onUndo: handleUndo,
    onRedo: handleRedo,
    onToggleComment: handleToggleComment,
    onIndent: handleIndent,
    onOutdent: handleOutdent,
    onEnter: handleEnter,
    onChord: handleChord
  });
  
  const handleInput = useCallback((event) => {
    const newContent = event.target.value;
    pushToHistory(content);
    setContent(newContent);
    debouncedHighlight();
  }, [content, pushToHistory, setContent, debouncedHighlight]);
  
  const handleKeyEvent = useCallback((event) => {
    const eventDetails = getEventDetails(event);
    onEvent?.(eventDetails);
  }, [onEvent]);
  
  // Expose functions to window for testing
  useEffect(() => {
    window.getEditorState = getState;
    window.getHighlightCallCount = () => highlightCallCount;
    
    return () => {
      delete window.getEditorState;
      delete window.getHighlightCallCount;
    };
  }, [getState, highlightCallCount]);
  
  return (
    <div className="editor-container" data-test-id="editor-container">
      <div className="editor-header">
        <h3>Code Editor</h3>
      </div>
      <textarea
        ref={textareaRef}
        className="editor-input"
        data-test-id="editor-input"
        value={content}
        onChange={handleInput}
        onKeyDown={(e) => {
          handleKeyEvent(e);
          handleKeyDown(e);
        }}
        onKeyUp={handleKeyEvent}
        onCompositionStart={handleKeyEvent}
        onCompositionUpdate={handleKeyEvent}
        onCompositionEnd={handleKeyEvent}
        placeholder="Start typing your code..."
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
};

export default Editor;
