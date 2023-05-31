package impl

import (
	"backend/pkg/dto"
)

func (s *postService) GetPosts(req dto.GetPostsReq) ([]dto.PostResponse, error) {

	posts, err := s.repo.GetPosts(req)
	if err != nil {
		return []dto.PostResponse{}, err
	}

	var postsResponse []dto.PostResponse
	for _, post := range posts {
		postResponse := dto.ConvertPostToPostResponse(post)

		// Check is_liked
		if postResponse.IsLiked, err = s.repoLike.CheckIsLiked(post.ID, req.UserID); err != nil {
			return []dto.PostResponse{}, err
		}
		// get total likes
		if postResponse.TotalLikes, err = s.repoLike.GetTotalLikes(post.ID); err != nil {
			return []dto.PostResponse{}, err
		}

		// Get total comments
		if postResponse.TotalComments, err = s.repoComment.GetTotalComments(post.ID); err != nil {
			return []dto.PostResponse{}, err
		}

		// Check is_saved
		if postResponse.IsSaved, err = s.repoSave.CheckIsSaved(post.ID, req.UserID); err != nil {
			return []dto.PostResponse{}, err
		}
		// Get total save
		if postResponse.TotalSaves, err = s.repoSave.GetTotalSaves(post.ID); err != nil {
			return []dto.PostResponse{}, err
		}

		postsResponse = append(postsResponse, postResponse)
	}

	return postsResponse, nil
}
