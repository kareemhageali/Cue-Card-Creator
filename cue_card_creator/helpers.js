export const setCookie = (key, value) => {
    let date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
    document.cookie = key + '=' + value + ';' + expires + ';path=/';
};

export const getCookie = (key) => {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + key + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
};