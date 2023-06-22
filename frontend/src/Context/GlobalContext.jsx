import React, { createContext, useState } from 'react';

// Create the context
const GlobalContext = createContext();

// Create a provider component
const GlobalProvider = ({ children }) => {
    const [activeTabsSetting, setactiveTabsSetting] = useState('Notification');


    const context_state = { activeTabsSetting, setactiveTabsSetting }
    return (
        <GlobalContext.Provider value={context_state}>
            {children}
        </GlobalContext.Provider>
    );
};

export { GlobalProvider, GlobalContext };
