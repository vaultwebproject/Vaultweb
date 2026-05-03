import React, { use, useContext, useState } from "react";

export const UserContext = React.createContext();

const UserProvider = props => {
    const [userName, setUserName] = useState("");
    const [userKey, setUserKey] = useState("");
    const [uuID, setuuID] = useState("");
    const [privateKey, setPrivateKey] = useState("");

    return (
        <Context.UserProvider value={{userName, setUserName, uuID, setuuID, userKey, setUserKey, privateKey, setPrivateKey}}>
            {props.children}
        </Context.UserProvider>
    );
}

export default UserProvider;
