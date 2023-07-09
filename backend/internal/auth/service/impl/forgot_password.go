package impl

import (
	customerrors "backend/pkg/errors"
	"backend/pkg/utils/emailutils"
	"backend/pkg/utils/randomutils"
	"fmt"
	"time"

	"gopkg.in/gomail.v2"
)

func (s *authService) ForgotPassword(email string) error {

	user, err := s.repo.GetUserByEmail(email)
	if err != nil {
		if err == customerrors.ErrAccountNotFound {
			return customerrors.ErrEmailNotFound
		}
		return err
	}
	// Generate code
	code := randomutils.GenerateRandomString(10)

	// Send email
	body, err := emailutils.SendResetPasswordBody(emailutils.SendResetPasswordParams{
		Link: fmt.Sprintf("%s/?reset_password=true&code=%s&email=%s", s.config.FrontEndURL, code, email),
		Name: user.Name,
	})
	if err != nil {
		s.log.Warningln("[ERROR] Email error : ", err.Error())
		return err
	}
	// mg := s.mailgun.NewMessage(
	// 	s.config.Mailgun.SenderEmail,
	// 	"Esa Unggul - Reset Password",
	// 	body,
	// 	email,
	// )
	// mg.SetHtml(body)

	mailer := gomail.NewMessage()
	mailer.SetHeader("From", fmt.Sprintf("Esa Unggul Social Media <%s> ", s.config.Gmail.SenderEmail))
	mailer.SetHeader("To", email)
	mailer.SetHeader("Subject", "Reset Password")
	mailer.SetBody("text/html", body)

	if s.config.Server.Environment != "dev" {
		// _, _, err = s.mailgun.Send(context.Background(), mg)
		err = s.gmail.DialAndSend(mailer)
		if err != nil {
			s.log.Warningln("[ERROR] while send the email:", err.Error())
			return err
		}
	}

	// Set Redis
	err = s.redis.Set(s.redis.Context(), email, code, 15*time.Minute).Err()
	if err != nil {
		s.log.Warningln("[ERROR] while insert valur to redis:", err.Error())
		return err
	}

	return nil
}
