package impl

import (
	"backend/pkg/utils/emailutils"
	"fmt"

	"gopkg.in/gomail.v2"
)

func (s *userService) SendPasswordToUserEmailByGmail(password, email string) error {
	body, err := emailutils.SendPasswordBody(emailutils.SendPasswordParams{Password: password})
	if err != nil {
		s.log.Warningln("email error : ", err.Error())
		return err
	}
	mailer := gomail.NewMessage()
	mailer.SetHeader("From", fmt.Sprintf("Esa Unggul Social Media <%s> ", s.config.Gmail.SenderEmail))
	mailer.SetHeader("To", email)
	mailer.SetHeader("Subject", "Your Login Password")
	mailer.SetBody("text/html", body)

	err = s.gmail.DialAndSend(mailer)
	if err != nil {
		s.log.Warningln("[ERROR] while send the email:", err.Error())
		return err
	}

	return nil
}
