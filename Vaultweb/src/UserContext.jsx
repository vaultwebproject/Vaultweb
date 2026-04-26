import React, { useContext, useState } from "react";

export const UserContext = React.createContext();

const UserProvider = props => {
    const [userName, setUserName] = useState("");
    const [userKey, setUserKey] = useState("");
    const [uuID, setuuID] = useState("");
    const [orgId, setOrgId] = useState("");

    return (
        <Context.UserProvider value={{userName, setUserName, uuID, setuuID, userKey, setUserKey, orgId, setOrgId}}>
            {props.children}
        </Context.UserProvider>
    );
}

export default UserProvider;
