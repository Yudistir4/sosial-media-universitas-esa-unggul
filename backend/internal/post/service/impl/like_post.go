package impl

import "backend/pkg/dto"

func (s *postService) LikePost(req dto.PostAction) error {
	return s.repoLike.CreateLike(req)
}
