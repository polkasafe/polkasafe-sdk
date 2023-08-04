export const SUBSCAN_API_KEY = global.process?.env.REACT_APP_SUBSCAN_API_KEY || '';

export const SUBSCAN_API_HEADERS = {
	'Accept': 'application/json',
	'Content-Type': 'application/json',
	'X-API-Key': SUBSCAN_API_KEY
};
