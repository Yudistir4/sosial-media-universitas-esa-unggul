package service

import "backend/pkg/dto"

type AuthService interface {
	Login(req dto.LoginReq) (dto.LoginRes, error)
	ForgotPassword(email string) error
	ValidateResetPasswordCode(req dto.ValidateResetPasswordCodeReq)error
	ResetPasswordAfterForgot(req dto.ResetPasswordAfterForgotReq) error
	ResetPassword(req dto.ResetPasswordReq) error
	RefreshToken(req dto.RefreshTokenReq) (dto.RefreshTokenRes, error)
	ChangeEmail(req dto.ChangeEmailReq) error
	VerifyEmail(req dto.VerifyEmailReq) error
}
