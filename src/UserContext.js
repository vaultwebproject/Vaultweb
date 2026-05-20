import React, { useState } from "react";

export const UserContext = React.createContext();

const UserProvider = (props) => {
    const [userName, setUserName] = useState("");
    const [userKey, setUserKey] = useState("");
    const [uuID, setuuID] = useState("");
    const [organisationId, setOrganisationId] = useState(null);
    const [userRole, setUserRole] = useState("Member");

    return React.createElement(
        UserContext.Provider,
        { value: { userName, setUserName, uuID, setuuID, userKey, setUserKey, organisationId, setOrganisationId, userRole, setUserRole } },
        props.children
    );
};

export default UserProvider;
