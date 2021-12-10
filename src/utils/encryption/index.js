import {SECURITYKEY} from './security'
import {CryptoJS} from './aes'

 export const desEncrypt = (value) => {
	 var keyObj = {};
	keyObj = SECURITYKEY.get();
	value = CryptoJS.AES.encrypt(value, CryptoJS.enc.Utf8.parse(keyObj.key),{
				iv:CryptoJS.enc.Utf8.parse(keyObj.iv)
			}).toString();
	return keyObj.security + value;
}

