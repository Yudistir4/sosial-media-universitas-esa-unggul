package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
)

func (s *postService) GetComments(req dto.GetCommentsReq) ([]dto.CommentResponse, error) {
	if _, err := s.repo.GetPostByID(req.PostID); err != nil {
		if err == customerrors.ErrPostNotFound {
			return []dto.CommentResponse{}, customerrors.ErrPostHasBeenDeleted
		}
		return []dto.CommentResponse{}, err
	}

	comments, err := s.repoComment.GetComments(req)
	if err != nil {
		return []dto.CommentResponse{}, err
	}

	var commentsResponse []dto.CommentResponse
	for _, comment := range comments {
		commentResponse := dto.ConvertCommentToCommentResponse(comment)
		commentsResponse = append(commentsResponse, commentResponse)
	}

	return commentsResponse, nil

}
