package handler

import (
	"backend/internal/post/service"
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"backend/pkg/utils/httputils"
	"backend/pkg/utils/tokenutils"
	"os"

	"github.com/labstack/echo/v4"
)

func (h *postHandler) CreatePost(service service.PostService) echo.HandlerFunc {
	return func(c echo.Context) error {

		// Get Logged In User From Token
		loggedInUser, ok := c.Get("user").(tokenutils.Payload)
		if !ok {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrInternalServer,
			})
		}

		// Binding data and assign userID
		var req dto.CreatePostReq
		err := c.Bind(&req)
		req.UserID = loggedInUser.UserID
		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrBadRequest,
			})
		}

		// Assign Content File if exist
		req.ContentFile, _ = c.FormFile("content_file")
		if req.ContentFile != nil {
			ok := httputils.CheckPostFileType(req.ContentFile)
			if !ok {
				return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
					Err: customerrors.ErrBadRequestFileType,
				})

			}
			req.ContentType = httputils.GetContentType(req.ContentFile)

			var err error
			req.ContentFileSrc, err = httputils.HandleFileForm(req.ContentFile)
			if err != nil {
				return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
					Err: customerrors.ErrBadRequest,
				})
			}
			defer os.Remove(req.ContentFileSrc)
		}

		// Check Post Category
		if req.PostCategory != "" {
			ok = dto.CheckPostCategory(req.PostCategory)
			if !ok {
				return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
					Err: customerrors.ErrInvalidPostCategory,
				})
			}
		}

		// Validasi struct
		err = h.validator.StructCtx(c.Request().Context(), req)
		if err != nil {
			errStr := h.validator.TranslateValidatorError(err)
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err:    customerrors.ErrBadRequest,
				Detail: errStr,
			})
		}

		post, err := service.CreatePost(req)
		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: err,
			})
		}
		return httputils.SuccessResponse(c, httputils.SuccessResponseParams{
			Data:    post,
			Message: "Create post successfully",
		})

	}
}
