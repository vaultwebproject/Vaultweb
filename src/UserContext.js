import React, { useState } from "react";

export const UserContext = React.createContext();

const UserProvider = (props) => {
    const [userName, setUserName] = useState("");
    const [userKey, setUserKey] = useState("");
    const [uuID, setuuID] = useState("");

    return React.createElement(
        UserContext.Provider,
        { value: { userName, setUserName, uuID, setuuID, userKey, setUserKey } },
        props.children
    );
};

export default UserProvider;
