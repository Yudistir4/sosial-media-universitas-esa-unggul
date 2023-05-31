package impl

import "backend/pkg/dto"

func (s *postService) SavePost(req dto.PostAction) error {
	return s.repoSave.CreateSave(req)
}
