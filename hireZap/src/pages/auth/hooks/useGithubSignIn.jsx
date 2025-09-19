// src/hooks/useGithubAuth.js
const useGithubSignIn = () => {
  const redirectToGithub = (role) => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/github/callback`;
    const scope = "user:email";
    const state = role; // pass role dynamically

    window.location.href =
      `https://github.com/login/oauth/authorize` +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${scope}` +
      `&state=${state}`;
  };

  return { redirectToGithub };
};

export default useGithubSignIn;
