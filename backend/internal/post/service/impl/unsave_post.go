package impl

import "backend/pkg/dto"

func (s *postService) UnsavePost(req dto.PostAction) error {
	return s.repoSave.DeleteSave(req)
}
