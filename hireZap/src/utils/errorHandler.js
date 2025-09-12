export const getFriendlyError =(err, defaultMsg="something went wrong") =>{
    console.error("Api Error",err?.response?.status,err);
    return (
        err.response?.data?.detail ||
        err.response?.data?.message ||
        defaultMsg
    );
};