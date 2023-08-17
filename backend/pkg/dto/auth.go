package dto

import "github.com/google/uuid"

type LoginReq struct {
	Email    string `json:"email" validate:"required"`
	Password string `json:"password" validate:"required"`
}
type LoginRes struct {
	AccessToken  string       `json:"access_token"`
	RefreshToken string       `json:"refresh_token"`
	User         UserResponse `json:"user"`
}
type ForgotPasswordReq struct {
	Email string `json:"email" validate:"required"`
}
type ValidateResetPasswordCodeReq struct {
	Email string `json:"email" validate:"required"`
	Code  string `json:"code" validate:"required"`
}
type ResetPasswordAfterForgotReq struct {
	Email       string `json:"email" validate:"required"`
	Code        string `json:"code" validate:"required"`
	NewPassword string `json:"new_password" validate:"required"`
}
type ResetPasswordReq struct {
	ID          uuid.UUID `validate:"required"`
	OldPassword string    `json:"old_password" validate:"required"`
	NewPassword string    `json:"new_password" validate:"required"`
}
type RefreshTokenReq struct {
	RefreshToken string `json:"refresh_token" validate:"required"`
}

type RefreshTokenRes struct {
	AccessToken string `json:"access_token"`
	ExpiresIn   int    `json:"expires_in" validate:"required"`
}
type ChangeEmailReq struct {
	ID       uuid.UUID `validate:"required"`
	NewEmail string    `json:"new_email" validate:"required"`
}
type VerifyEmailReq struct {
	ID               uuid.UUID `validate:"required"`
	VerificationCode string    `json:"verification_code" validate:"required"`
	NewEmail         string    `json:"new_email" validate:"required"`
}
