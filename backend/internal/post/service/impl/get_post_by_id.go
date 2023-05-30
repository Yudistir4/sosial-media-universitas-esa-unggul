package impl

import (
	"backend/pkg/dto"
)

func (s *postService) GetPostByID(req dto.GetPostByIDReq) (dto.PostResponse, error) {

	post, err := s.repo.GetPostByID(req.PostID)
	if err != nil {
		return dto.PostResponse{}, err
	}

	postResponse := dto.ConvertPostToPostResponse(post)
	// Check is_liked
	if postResponse.IsLiked, err = s.repoLike.CheckIsLiked(req.PostID, req.UserID); err != nil {
		return dto.PostResponse{}, err
	}
	// get total likes
	if postResponse.TotalLikes, err = s.repoLike.GetTotalLikes(req.PostID); err != nil {
		return dto.PostResponse{}, err
	}

	// Get total comments
	if postResponse.TotalComments, err = s.repoComment.GetTotalComments(req.PostID); err != nil {
		return dto.PostResponse{}, err
	}

	// Check is_saved
	if postResponse.IsSaved, err = s.repoSave.CheckIsSaved(req.PostID, req.UserID); err != nil {
		return dto.PostResponse{}, err
	}

	return postResponse, nil
}
