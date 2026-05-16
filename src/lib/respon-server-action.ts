export type ResponseServerActionType = {
    status: "success" | "error";
    message: string;
    data?: any;
};

export const ResponseServerAction = (props: ResponseServerActionType): ResponseServerActionType => {
    return {
        status: props.status,
        message: props.message,
        data: props.data
    };
};
