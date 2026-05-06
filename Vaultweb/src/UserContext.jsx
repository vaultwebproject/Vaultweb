import React, { useState } from "react";

export const UserContext = React.createContext();

const UserProvider = props => {
    const [userName, setUserName] = useState("");
    const [userKey, setUserKey] = useState("");
    const [uuID, setuuID] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [orgId, setOrgId] = useState("");
    const [role, setRole] = useState("");

    return (
        <UserContext.Provider
            value={{
                userName,
                setUserName,
                uuID,
                setuuID,
                userKey,
                setUserKey,
                privateKey,
                setPrivateKey,
                orgId,
                setOrgId,
                role,
                setRole
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
}

export default UserProvider;