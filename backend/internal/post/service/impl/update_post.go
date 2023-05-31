package impl

import "backend/pkg/dto"

func (s *postService) UpdatePost(req dto.UpdatePostByIDReq) (dto.PostResponse, error) {
	_, err := s.repo.UpdatePost(req)
	if err != nil {
		return dto.PostResponse{}, err
	}

	postResponse, err := s.GetPostByID(dto.GetPostByIDReq{
		PostID: req.PostID,
		UserID: req.UserID,
	})
	if err != nil {
		return dto.PostResponse{}, err
	}

	return postResponse, nil
}
