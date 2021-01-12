import "../../keycloak.js"
import {Attribute, setValueOf} from "../base/presentationModel/presentationModel.js";

export {authLocalController}

/**
 * @typedef AuthLocalController
 * @property {Function} login
 * @property {Function} logout
 *
 * Mock of authController to avoid running keycloak for frontend dev.
 */
const authLocalController = () => {

    const loggedIn = Attribute(false);

    const keycloak = {
        onReady: undefined,
        then: () => new Promise(() => undefined),  // don't handle it, not used at the moment
        catch: () => undefined,  // don't handle it, not used at the moment
    }

    const init = () => {
        setTimeout(() => keycloak.onReady(false), 500);
        return keycloak;
    }

    const login = () => {
        setValueOf(loggedIn)(true);
        keycloak.onReady(true);
    }

    const register = () => alert("Not implemented for local development");

    const logout = () => setValueOf(loggedIn)(false);

    /*
        example how to fake promise values.
        const loadUserProfile = () => {
            const profile = {email: "mab9.test@gmail.com"};
            return new Promise(res => res(profile))
        }

     */

    const fakeAccessToken = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJTMm05TE95aGcyTDBRZm9UZ0RTSXZ0R0JMUENsTzZiWTJ6UGphWUVpcTVRIn0.eyJleHAiOjE2MTA0NjM5NjQsImlhdCI6MTYxMDQ2MzY2NCwiYXV0aF90aW1lIjoxNjEwNDYzNjEwLCJqdGkiOiI2ODM2MTU2Yi0wODRhLTRmNzAtOThkNS1mMWU3NjU1NjVjNjciLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvdmFrYW5zaWUiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiMTdhMDQxODgtZmVkYy00YmZhLWI1MmYtNjAzM2FmNjQ0NzhiIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoidmFrYW5zaWUiLCJub25jZSI6ImFmZDgzYjMwLTQ2YTItNDNjNS05NDA4LWVhOTgxMDFkMWIwOSIsInNlc3Npb25fc3RhdGUiOiJkOTUxYjRkNi04MWQ2LTRlZGItYjdhYS0yYTRjM2EyNmRhNjQiLCJhY3IiOiIwIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3Q6NjMzNDIiLCIqIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiTWFyYy1BbnRvaW5lIEJydWVsaGFydCIsImdyb3VwcyI6WyJzaWUiXSwicHJlZmVycmVkX3VzZXJuYW1lIjoibWFyY2FudG9pbmUuYnJ1ZWxoYXJ0QGdtYWlsLmNvbSIsImdpdmVuX25hbWUiOiJNYXJjLUFudG9pbmUiLCJmYW1pbHlfbmFtZSI6IkJydWVsaGFydCIsImVtYWlsIjoibWFyY2FudG9pbmUuYnJ1ZWxoYXJ0QGdtYWlsLmNvbSJ9.AINGpGBfCwkIEUu2pSpq3XWwnHS68ICsCruoIGICxEagvtepCGc0oWDd_3tuw-TljSEl90G_agLoipnM_NK3z-gwp0f63T6t5_5IKWs-ONWk66zSz5SaswV9qs0ZElRh4o89EaQdBh3CpmT5PtVbUPbfHYSYlcPzjV4OHLXEYK75V97hf6__bLeY2jinSei7jGoBp0AWhPzme6-c8LaQgBW9R6RZSm9y65M1co5wqqToqTkYIYCrF2u5CnZrtbIuGKLXklidU6JGTEIHzANs2FkokfQLfOMVT7vmNwftgSNftXZ-kdBzvebWoDAfPZhtkHy5XVvEU8XsAkNegRm2jg";
    const getAccessTokenPayload = () => JSON.parse(atob(fakeAccessToken.split(".")[1]));

    const getUserDetails = () => {
        const jwtPayload = getAccessTokenPayload();
        return  {
            groups: jwtPayload.groups,
            roles: jwtPayload.realm_access.roles, // todo remove default roles? slice[..]
            email: jwtPayload.email,
            firstName: jwtPayload.given_name,
            lastName: jwtPayload.family_name,
        }
    }


    return Object.freeze({
        login: login,
        logout: logout,
        isLoggedIn: () => keycloak.authenticated,
        register: register,
        init: init,
        getUserDetails: getUserDetails,  // return fake profile
    })
}
