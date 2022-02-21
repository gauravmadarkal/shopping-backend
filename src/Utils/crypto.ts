import { secret, validityCharacters } from '../env';

export const encode = (enc_string: string, role: string) => {
	const enc = [];
	const text = `${validityCharacters};${enc_string};${role}`
	for (let i = 0; i < text.length; i += 1) {
		const keyC = secret[i % secret.length];
		const encC = `${String.fromCharCode((text[i].charCodeAt(0) + keyC.charCodeAt(0)) % 256)}`;
		enc.push(encC);
	}
	const str = enc.join('');
	return Buffer.from(str, 'binary').toString('base64');
};

  
export const decode = (ciphertext: string) => {
	const dec = [];
	const enc = Buffer.from(ciphertext, 'base64').toString('binary');
	for (let i = 0; i < enc.length; i += 1) {
		const keyC = secret[i % secret.length];
		const decC = `${String.fromCharCode((256 + enc[i].charCodeAt(0) - keyC.charCodeAt(0)) % 256)}`;
		dec.push(decC);
	}
	const decodedString: string = dec.join('');
	const arrStr: string[] = decodedString.split(";");
	if (arrStr.length === 3) {
		if (arrStr[0] === validityCharacters) {
			return {id: arrStr[1], role: arrStr[2]};
		}
		return undefined;
	}
	return undefined;
};