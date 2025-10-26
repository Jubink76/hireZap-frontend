const useLinkedinSignIn = () => {
  const redirectToLinkedin = (role) => {
    const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/linkedin/callback`;
    const state = role; // candidate or recruiter
    const scope = "r_liteprofile r_emailaddress";

    const linkedinAuthUrl =
      `https://www.linkedin.com/oauth/v2/authorization` +
      `?response_type=code` +
      `&client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&state=${state}` +
      `&scope=${encodeURIComponent(scope)}`;

    window.location.href = linkedinAuthUrl;
  };

  return { redirectToLinkedin };
};

export default useLinkedinSignIn;
