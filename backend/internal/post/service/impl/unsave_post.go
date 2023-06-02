package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
)

func (s *postService) UnsavePost(req dto.PostAction) error {
	_, err := s.repo.GetPostByID(req.PostID)
	if err != nil {
		if err == customerrors.ErrPostNotFound {
			return customerrors.ErrPostHasBeenDeleted
		}
		return err
	}
	return s.repoSave.DeleteSave(req)
}
