package emailutils

type SendResetPasswordParams struct {
	Link string
	Name string
}

func SendResetPasswordBody(params SendResetPasswordParams) (string, error) {
	return parseTemplate(sendResetPasswordLink, params)
}
