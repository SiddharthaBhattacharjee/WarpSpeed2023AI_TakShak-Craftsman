import { createContext, useState } from "react";

export const Appcontext = createContext();
export const AppcontextProvider = (props) => {
    const [changeID, setChangeID] = useState(false);
    const [changeStatus, setChangeStatus] = useState(false);
    return (
        <Appcontext.Provider value={{ changeID, setChangeID, changeStatus, setChangeStatus }}>
            {props.children}
        </Appcontext.Provider>
    );
};