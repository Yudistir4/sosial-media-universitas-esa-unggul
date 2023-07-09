package config

import "gopkg.in/gomail.v2"

type Gmail struct {
	GmailAuthPassword string
	SenderEmail       string
	SMTPHost string
	SMTPPort int

}

func InitGmail(params *Gmail) *gomail.Dialer {
	dialer := gomail.NewDialer(
		params.SMTPHost,
		params.SMTPPort,
		params.SenderEmail,
		params.GmailAuthPassword,
	)
	return dialer
}
