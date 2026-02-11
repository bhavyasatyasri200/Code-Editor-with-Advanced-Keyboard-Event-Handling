import { useCallback, useRef, useState } from 'react';
import { isModifierPressed } from '../utils/keyboardUtils';

export const useKeyboardShortcuts = (callbacks) => {
  const [chordState, setChordState] = useState(null);
  const chordTimeoutRef = useRef(null);
  
  const handleKeyDown = useCallback((event) => {
    const { key, shiftKey } = event;
    const isModifier = isModifierPressed(event);
    
    // Handle chord shortcuts
    if (isModifier && key === 'k') {
      event.preventDefault();
      setChordState('k');
      
      // Clear any existing timeout
      if (chordTimeoutRef.current) {
        clearTimeout(chordTimeoutRef.current);
      }
      
      // Set timeout for chord sequence
      chordTimeoutRef.current = setTimeout(() => {
        setChordState(null);
      }, 2000);
      
      return;
    }
    
    // Handle second part of chord
    if (chordState === 'k' && isModifier && key === 'c') {
      event.preventDefault();
      setChordState(null);
      if (chordTimeoutRef.current) {
        clearTimeout(chordTimeoutRef.current);
      }
      callbacks.onChord?.();
      return;
    }
    
    // Reset chord state on any other key
    if (chordState) {
      setChordState(null);
      if (chordTimeoutRef.current) {
        clearTimeout(chordTimeoutRef.current);
      }
    }
    
    // Handle regular shortcuts
    if (isModifier) {
      switch (key) {
        case 's':
          event.preventDefault();
          callbacks.onSave?.();
          break;
        case 'z':
          event.preventDefault();
          if (shiftKey) {
            callbacks.onRedo?.();
          } else {
            callbacks.onUndo?.();
          }
          break;
        case '/':
          event.preventDefault();
          callbacks.onToggleComment?.();
          break;
        default:
          break;
      }
    } else {
      switch (key) {
        case 'Tab':
          event.preventDefault();
          if (shiftKey) {
            callbacks.onOutdent?.();
          } else {
            callbacks.onIndent?.();
          }
          break;
        case 'Enter':
          // Let the default Enter behavior happen, but trigger callback
          callbacks.onEnter?.(event);
          break;
        default:
          break;
      }
    }
  }, [callbacks, chordState]);
  
  return { handleKeyDown };
};
