package emailutils

type SendPasswordParams struct {
	Password string
}

func SendPasswordBody(params SendPasswordParams) (string, error) {
	return parseTemplate(sendPassword, params)
}
