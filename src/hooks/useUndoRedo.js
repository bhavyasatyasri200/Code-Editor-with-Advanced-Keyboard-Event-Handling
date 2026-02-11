import { useState, useCallback } from 'react';

export const useUndoRedo = (initialState) => {
  const [currentState, setCurrentState] = useState(initialState);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  
  const pushToHistory = useCallback((newState) => {
    if (newState !== currentState) {
      setUndoStack(prev => [...prev, currentState]);
      setRedoStack([]);
      setCurrentState(newState);
    }
  }, [currentState]);
  
  const undo = useCallback(() => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setUndoStack(prev => prev.slice(0, -1));
      setRedoStack(prev => [...prev, currentState]);
      setCurrentState(previousState);
      return previousState;
    }
    return currentState;
  }, [undoStack, currentState]);
  
  const redo = useCallback(() => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setRedoStack(prev => prev.slice(0, -1));
      setUndoStack(prev => [...prev, currentState]);
      setCurrentState(nextState);
      return nextState;
    }
    return currentState;
  }, [redoStack, currentState]);
  
  const getState = useCallback(() => ({
    content: currentState,
    historySize: undoStack.length + 1
  }), [currentState, undoStack.length]);
  
  return {
    state: currentState,
    setState: setCurrentState,
    pushToHistory,
    undo,
    redo,
    getState
  };
};
