import * as soap from 'soap';
import { soap_server_url } from '../env';

export const ResponseFormatter = (
	body: any,
	status: any,
	error=undefined
): any => {
	return {
		data: body,
		status,
		error
	}
}

export const initiatePayment = (cardDetails: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		soap.createClient(soap_server_url, (err, client) => {
			client.InitiatePayment(cardDetails, function(err: any, result: any) {
				resolve(result);
			});
		});
	})
}