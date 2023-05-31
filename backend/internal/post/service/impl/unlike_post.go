package impl

import "backend/pkg/dto"

func (s *postService) UnlikePost(req dto.PostAction) error {
	return s.repoLike.DeleteLike(req)
}
