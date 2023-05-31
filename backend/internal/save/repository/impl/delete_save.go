package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
)

func (r *saveRepository) DeleteSave(req dto.PostAction) error {
	ok, err := r.CheckIsSaved(req.PostID, req.UserID)
	if err != nil {
		return err
	}
	if !ok {
		return customerrors.ErrPostHasBeenUnsaved
	}

	result := r.db.Where("post_id = ? AND user_id = ?", req.PostID, req.UserID).Delete(&dto.Save{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}
