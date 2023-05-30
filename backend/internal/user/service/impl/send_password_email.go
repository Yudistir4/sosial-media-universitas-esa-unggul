package impl

import (
	"backend/pkg/utils/emailutils"
	"context"
)

func (s *userService) SendPasswordToUserEmail(password, email string) error {
	body, err := emailutils.SendPasswordBody(emailutils.SendPasswordParams{Password: password})
	if err != nil {
		s.log.Warningln("email error : ", err.Error())
		return err
	}
	mg := s.mailgun.NewMessage(
		s.config.Mailgun.SenderEmail,
		"Esa Unggul - Your Login Password",
		body,
		email,
	)
	mg.SetHtml(body)
	_, _, err = s.mailgun.Send(context.Background(), mg)
	if err != nil {
		s.log.Warningln("[ERROR] while send the email:", err.Error())
		return err
	}

	return nil
}
