import { isNil } from "lodash";

export type ServiceResult<T> = {
	status: "OK" | "ERROR";
	data?: T;
	message: string;
};

export const createServiceResult = <T>(
	status: "OK" | "ERROR",
	message?: string,
	data?: T,
): ServiceResult<T> => {
	return {
		status,
		message: isNil(message) ? "" : message,
		data,
	};
};
