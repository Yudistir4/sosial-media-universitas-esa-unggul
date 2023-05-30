package emailutils

type SendEmailVerificationCodeParams struct {
	Code string
}

func SendEmailVerificationCodeBody(params SendEmailVerificationCodeParams) (string, error) {
	return parseTemplate(sendEmailVerificationCode, params)
}
