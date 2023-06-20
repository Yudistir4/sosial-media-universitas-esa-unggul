package customerrors

import (
	"backend/pkg/dto"
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/go-sql-driver/mysql"
)

var (
	ErrDuplicatedNIM                          = errors.New("NIM already exists")
	ErrDuplicatedFacultyName                  = errors.New("Faculty name already exists")
	ErrDuplicatedStudyProgramName             = errors.New("Study program name already exists")
	ErrDuplicatedNIDN                         = errors.New("NIDN already exists")
	ErrDuplicatedEmail                        = errors.New("Email already exists")
	ErrInternalServer                         = errors.New("internal server error")
	ErrBadRequest                             = errors.New("bad request")
	ErrPostHasBeenLiked                       = errors.New("The post has already been liked.")
	ErrPostHasBeenUnliked                     = errors.New("The post has already been unliked.")
	ErrPostHasBeenSaved                       = errors.New("The post has already been saved.")
	ErrPostHasBeenUnsaved                     = errors.New("The post has already been unsaved.")
	ErrInvalidPostCategory                    = errors.New("Invalid post category")
	ErrEmailRelatedToAnotherAccount           = errors.New("The email address provided is already associated with another account. Please enter a different email address to proceed.")
	ErrNewEmailSameAsCurrentEmail             = errors.New("The new email address provided is the same as the current email address associated with your account. Please enter a different email address to update your email.")
	ErrOldPasswordInvalid                     = errors.New("Invalid old password. Please enter the correct old password.")
	ErrResetPasswordLinkExpiredOrNotExist     = errors.New("Reset password link has expired or not exist. Please request a new password reset link.")
	ErrEmailVerificationCodeExpiredOrNotExist = errors.New("Email verification code has expired or not exist. Please request a new email verification code.")
	ErrInvalidResetPasswordCode               = errors.New("Invalid reset password link. Please request a new password reset link.")
	ErrInvalidVerifyCode                      = errors.New("Invalid verification code.")
	ErrBadRequestFileType                     = errors.New("Invalid file type")
	ErrRecordNotFound                         = errors.New("record not found")
	ErrPostNotFound                           = errors.New("Post not found")
	ErrPostHasBeenDeleted                     = errors.New("The post has already been deleted.")
	ErrCommentHasBeenDeleted                  = errors.New("The comment has already been deleted.")
	ErrAccountNotFound                        = errors.New("The entered account does not exist")
	ErrNotFound                               = errors.New("not found")
	ErrUserNotFound                           = errors.New("User not found")
	ErrCommentNotFound                        = errors.New("Comment not found")
	ErrStudyProgramNotFound                   = errors.New("Study program not found")
	ErrUnauthorizedUserAction                 = errors.New("Sorry, you are not authorized to perform this action.")
	ErrUnauthorized                           = errors.New("unauthorized")
	ErrAccessTokenExpired                     = errors.New("Access token has expired")
	ErrRefreshTokenExpired                    = errors.New("Refresh token has expired")
	ErrUnauthorizedRole                       = errors.New("Access denied. You are not authorized role to perform this action.")
	ErrInvalidAccessToken                     = errors.New("Invalid access token")
	ErrAccountDuplicated                      = errors.New("email or username has already exists")
	ErrUniqueRecord                           = errors.New("record duplicated, must be unique")
	ErrUsernameDuplicated                     = errors.New("username duplicated, must be unique")
	ErrEmailPasswordIncorrect                 = errors.New("email or password is incorrect")
)

var errMap map[error]dto.ErrorResponse = map[error]dto.ErrorResponse{
	ErrInternalServer:                         {HTTPErrorCode: http.StatusInternalServerError, Message: ErrInternalServer.Error()},
	ErrBadRequest:                             {HTTPErrorCode: http.StatusBadRequest, Message: ErrBadRequest.Error()},
	ErrPostHasBeenLiked:                       {HTTPErrorCode: http.StatusConflict, Message: ErrPostHasBeenLiked.Error()},
	ErrPostHasBeenSaved:                       {HTTPErrorCode: http.StatusConflict, Message: ErrPostHasBeenSaved.Error()},
	ErrPostHasBeenUnsaved:                     {HTTPErrorCode: http.StatusConflict, Message: ErrPostHasBeenUnsaved.Error()},
	ErrPostHasBeenUnliked:                     {HTTPErrorCode: http.StatusConflict, Message: ErrPostHasBeenUnliked.Error()},
	ErrInvalidPostCategory:                    {HTTPErrorCode: http.StatusBadRequest, Message: ErrInvalidPostCategory.Error()},
	ErrEmailRelatedToAnotherAccount:           {HTTPErrorCode: http.StatusBadRequest, Message: ErrEmailRelatedToAnotherAccount.Error()},
	ErrNewEmailSameAsCurrentEmail:             {HTTPErrorCode: http.StatusBadRequest, Message: ErrNewEmailSameAsCurrentEmail.Error()},
	ErrOldPasswordInvalid:                     {HTTPErrorCode: http.StatusBadRequest, Message: ErrOldPasswordInvalid.Error()},
	ErrResetPasswordLinkExpiredOrNotExist:     {HTTPErrorCode: http.StatusBadRequest, Message: ErrResetPasswordLinkExpiredOrNotExist.Error()},
	ErrEmailVerificationCodeExpiredOrNotExist: {HTTPErrorCode: http.StatusBadRequest, Message: ErrEmailVerificationCodeExpiredOrNotExist.Error()},
	ErrInvalidResetPasswordCode:               {HTTPErrorCode: http.StatusBadRequest, Message: ErrInvalidResetPasswordCode.Error()},
	ErrInvalidVerifyCode:                      {HTTPErrorCode: http.StatusBadRequest, Message: ErrInvalidVerifyCode.Error()},
	ErrBadRequestFileType:                     {HTTPErrorCode: http.StatusBadRequest, Message: ErrBadRequestFileType.Error()},
	ErrRecordNotFound:                         {HTTPErrorCode: http.StatusNotFound, Message: ErrRecordNotFound.Error()},
	ErrAccountNotFound:                        {HTTPErrorCode: http.StatusNotFound, Message: ErrAccountNotFound.Error()},
	ErrNotFound:                               {HTTPErrorCode: http.StatusNotFound, Message: ErrNotFound.Error()},
	ErrPostNotFound:                           {HTTPErrorCode: http.StatusNotFound, Message: ErrPostNotFound.Error()},
	ErrPostHasBeenDeleted:                     {HTTPErrorCode: http.StatusNotFound, Message: ErrPostHasBeenDeleted.Error()},
	ErrCommentHasBeenDeleted:                  {HTTPErrorCode: http.StatusNotFound, Message: ErrCommentHasBeenDeleted.Error()},
	ErrUserNotFound:                           {HTTPErrorCode: http.StatusNotFound, Message: ErrUserNotFound.Error()},
	ErrCommentNotFound:                        {HTTPErrorCode: http.StatusNotFound, Message: ErrCommentNotFound.Error()},
	ErrStudyProgramNotFound:                   {HTTPErrorCode: http.StatusNotFound, Message: ErrStudyProgramNotFound.Error()},
	ErrUnauthorized:                           {HTTPErrorCode: http.StatusUnauthorized, Message: ErrUnauthorized.Error()},
	ErrUnauthorizedUserAction:                 {HTTPErrorCode: http.StatusUnauthorized, Message: ErrUnauthorizedUserAction.Error()},
	ErrAccessTokenExpired:                     {HTTPErrorCode: http.StatusUnauthorized, Message: ErrAccessTokenExpired.Error()},
	ErrRefreshTokenExpired:                    {HTTPErrorCode: http.StatusUnauthorized, Message: ErrRefreshTokenExpired.Error()},
	ErrUnauthorizedRole:                       {HTTPErrorCode: http.StatusUnauthorized, Message: ErrUnauthorizedRole.Error()},
	ErrInvalidAccessToken:                     {HTTPErrorCode: http.StatusUnauthorized, Message: ErrInvalidAccessToken.Error()},
	ErrDuplicatedEmail:                        {HTTPErrorCode: http.StatusBadRequest, Message: ErrDuplicatedEmail.Error()},
	ErrDuplicatedNIM:                          {HTTPErrorCode: http.StatusBadRequest, Message: ErrDuplicatedNIM.Error()},
	ErrDuplicatedFacultyName:                  {HTTPErrorCode: http.StatusBadRequest, Message: ErrDuplicatedFacultyName.Error()},
	ErrDuplicatedStudyProgramName:             {HTTPErrorCode: http.StatusBadRequest, Message: ErrDuplicatedStudyProgramName.Error()},
	ErrDuplicatedNIDN:                         {HTTPErrorCode: http.StatusBadRequest, Message: ErrDuplicatedNIDN.Error()},
	ErrAccountDuplicated:                      {HTTPErrorCode: http.StatusBadRequest, Message: ErrAccountDuplicated.Error()},
	ErrUniqueRecord:                           {HTTPErrorCode: http.StatusBadRequest, Message: ErrUniqueRecord.Error()},
	ErrUsernameDuplicated:                     {HTTPErrorCode: http.StatusBadRequest, Message: ErrUsernameDuplicated.Error()},
	ErrEmailPasswordIncorrect:                 {HTTPErrorCode: http.StatusUnauthorized, Message: ErrEmailPasswordIncorrect.Error()},
}

func GetErr(param error) dto.ErrorResponse {
	res, exists := errMap[param]
	if !exists {
		return errMap[ErrInternalServer]
	}
	return res
}

const (
	mysqlErrDuplicateEntry      = 1062
	mysqlErrForeignKeyViolation = 1452
)

func GetErrorType(err error) error {
	if mysqlErr, ok := err.(*mysql.MySQLError); ok {
		// Check the MySQL error code
		switch mysqlErr.Number {
		case mysqlErrDuplicateEntry:
			if strings.Contains(mysqlErr.Message, "nim") {
				return ErrDuplicatedNIM
			} else if strings.Contains(mysqlErr.Message, "email") {
				return ErrDuplicatedEmail
			} else if strings.Contains(mysqlErr.Message, "nidn") {
				return ErrDuplicatedNIDN
			}
		case mysqlErrForeignKeyViolation:
			fmt.Println("Foreign key violation:", mysqlErr.Message)
		default:
			// Handle other MySQL errors
			fmt.Println("MySQL error:", mysqlErr.Error())
		}
	}
	return ErrInternalServer

}
