package handler

import (
	"backend/internal/user/service"
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"backend/pkg/utils/httputils"
	"backend/pkg/utils/tokenutils"

	"github.com/labstack/echo/v4"
)

func (h *userHandler) UpdateUser(service service.UserService) echo.HandlerFunc {
	return func(c echo.Context) error {
		loggedInUser, ok := c.Get("user").(tokenutils.Payload)
		if !ok || loggedInUser.UserType != "university" {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrUnauthorizedRole,
			})
		}

		var req dto.UpdateUserReq
		err := c.Bind(&req)

		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrBadRequest,
			})
		}
		err = h.validator.StructCtx(c.Request().Context(), req)
		if err != nil {
			errStr := h.validator.TranslateValidatorError(err)
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err:    customerrors.ErrBadRequest,
				Detail: errStr,
			})
		}
		if req.UserType == "student" {
			student := dto.UpdateUserStudentReq{
				NIM:            req.NIM,
				BatchYear:      req.BatchYear,
				FacultyID:      req.FacultyID,
				StudyProgramID: req.StudyProgramID,
			}
			err = h.validator.StructCtx(c.Request().Context(), student)

		} else if req.UserType == "lecturer" {
			lecturer := dto.UpdateUserLecturerReq{
				NIDN:           req.NIDN,
				FacultyID:      req.FacultyID,
				StudyProgramID: req.StudyProgramID,
			}
			err = h.validator.StructCtx(c.Request().Context(), lecturer)
		}

		if err != nil {
			errStr := h.validator.TranslateValidatorError(err)
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err:    customerrors.ErrBadRequest,
				Detail: errStr,
			})
		}

		user, err := service.UpdateUser(req)
		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: err,
			})
		}
		return httputils.SuccessResponse(c, httputils.SuccessResponseParams{
			Data:    user,
			Message: "Update user successfully",
		})

	}
}
