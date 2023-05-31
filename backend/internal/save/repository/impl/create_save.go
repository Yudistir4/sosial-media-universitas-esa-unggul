package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
)

func (r *saveRepository) CreateSave(req dto.PostAction) error {

	ok, err := r.CheckIsSaved(req.PostID, req.UserID)
	if err != nil {
		return err
	}
	if ok {
		return customerrors.ErrPostHasBeenSave
	}
	save := dto.Save{
		ID:     uuid.New(),
		PostID: req.PostID,
		UserID: req.UserID,
	}

	result := r.db.Create(&save)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
