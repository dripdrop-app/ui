const isProd = process.env.NODE_ENV === 'production';
const webSocketProtocol = isProd ? 'wss' : 'ws';
const httpProtocol = isProd ? 'https' : 'http';
const serverDomain = isProd ? window.location.host : process.env.REACT_APP_SERVER_URL;

export const buildURL = (endpoint: string) => `${httpProtocol}://${serverDomain}/${endpoint}`;
export const buildWebsocketURL = (endpoint: string) => `${webSocketProtocol}://${serverDomain}/api/${endpoint}`;
