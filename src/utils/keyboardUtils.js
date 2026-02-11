export const isMac = () => {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  };
  
  export const isModifierPressed = (event) => {
    return isMac() ? event.metaKey : event.ctrlKey;
  };
  
  export const getEventDetails = (event) => {
    return {
      type: event.type,
      key: event.key,
      code: event.code,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey,
      timestamp: Date.now()
    };
  };
  
  export const formatEventForDisplay = (eventDetails) => {
    const modifiers = [];
    if (eventDetails.ctrlKey) modifiers.push('Ctrl');
    if (eventDetails.metaKey) modifiers.push('Cmd');
    if (eventDetails.shiftKey) modifiers.push('Shift');
    if (eventDetails.altKey) modifiers.push('Alt');
    
    const modifierStr = modifiers.length > 0 ? `${modifiers.join('+')}+` : '';
    return `${eventDetails.type}: ${modifierStr}${eventDetails.key}`;
  };
  