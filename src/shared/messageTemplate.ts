const sendPhoneValidationMessage =(code:number)=>{
    return (
        `
        Your verification code is ${code}.
        Please enter this code when requested.
        Thank you.
        `
    )
}

export const phoneTamplate = {
    sendPhoneValidationMessage,
}