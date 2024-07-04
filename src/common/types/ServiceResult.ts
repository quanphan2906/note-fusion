export type ServiceResult<T> = {
	status: "OK" | "ERROR";
	data?: T;
	message: string;
};
