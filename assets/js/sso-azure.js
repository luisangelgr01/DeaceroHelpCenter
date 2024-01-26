const msalConfig = {
  auth: {
    clientId: "e64b5fb7-5b8d-4562-b06f-3a59d1c79a21",
    authority:
      "https://login.microsoftonline.com/a4067d12-2fc0-4367-a213-9e4031cbc173",
    redirectUri: "https://helpcenter.deacero.com/",
    knownAuthorities: [
      "https://login.microsoftonline.com/a4067d12-2fc0-4367-a213-9e4031cbc173",
    ],
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

document.addEventListener("DOMContentLoaded", async function () {
  try {
    // Intentar obtener un token de acceso silenciosamente
    const silentResult = await msalInstance.acquireTokenSilent({
      scopes: ["openid", "profile", "user.read"], // Ajusta los alcances según tus necesidades
    });

    // Token de acceso renovado exitosamente
    console.log("Token renew success:", silentResult);
    getUserProfile();
  } catch (silentError) {
    // La autenticación silenciosa no pudo renovar el token, intentar iniciar sesión
    console.log("Attempting login...");
    msalInstance.loginRedirect().catch((loginError) => {
      console.error("Login error:", loginError);
    });
  }

  // Manejar la redirección después del inicio de sesión
  msalInstance
    .handleRedirectPromise()
    .then((response) => {
      if (response) {
        console.log("Login success:", response);
        getUserProfile();
      }
    })
    .catch((error) => {
      console.error("Login error:", error);
    });

  // Función para obtener el perfil del usuario
  function getUserProfile() {
    const user = msalInstance.getAccount();
    if (user) {
      console.log("User profile:", user);
      console.log("User email:", user.idTokenClaims.email);
    } else {
      console.error("User not authenticated");
    }
  }
});

const signOut = () => {
  msalInstance.logout();
};
