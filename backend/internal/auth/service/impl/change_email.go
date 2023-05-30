package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"backend/pkg/utils/emailutils"
	"backend/pkg/utils/randomutils"
	"context"
	"fmt"
	"time"
)

func (s *authService) ChangeEmail(req dto.ChangeEmailReq) error {
	user, err := s.repo.GetUserByEmail(req.NewEmail)
	if err == nil {
		return customerrors.ErrEmailRelatedToAnotherAccount
	}

	user, err = s.repo.GetUserByID(req.ID)
	if err != nil {
		return err
	}

	if user.Email == req.NewEmail {
		return customerrors.ErrNewEmailSameAsCurrentEmail
	}

	// Generate code
	code := randomutils.GenerateRandomString(10)

	// Send email
	body, err := emailutils.SendEmailVerificationCodeBody(emailutils.SendEmailVerificationCodeParams{
		Code: code,
	})
	if err != nil {
		s.log.Warningln("[ERROR] Email error : ", err.Error())
		return err
	}
	mg := s.mailgun.NewMessage(
		s.config.Mailgun.SenderEmail,
		"Esa Unggul - Email verification code",
		body,
		req.NewEmail,
	)
	mg.SetHtml(body)
	if s.config.Server.Environment != "dev" {
		_, _, err = s.mailgun.Send(context.Background(), mg)
		if err != nil {
			s.log.Warningln("[ERROR] while send the email:", err.Error())
			return err
		}
	}

	fmt.Println(code)

	// Set Redis
	key := req.NewEmail + "-change-email"
	err = s.redis.Set(s.redis.Context(), key, code, 15*time.Minute).Err()
	if err != nil {
		s.log.Warningln("[ERROR] while insert valur to redis:", err.Error())
		return err
	}

	return nil

}
