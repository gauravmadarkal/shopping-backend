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