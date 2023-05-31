package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
)

func (s *postService) CreateComment(req dto.CreateCommentReq) (dto.CommentResponse, error) {
	if _, err := s.repo.GetPostByID(req.PostID); err != nil {
		if err == customerrors.ErrPostNotFound {
			return dto.CommentResponse{}, customerrors.ErrPostHasBeenDeleted
		}
		return dto.CommentResponse{}, err
	}

	comment, err := s.repoComment.CreateComment(req)
	if err != nil {
		return dto.CommentResponse{}, err
	}
	if comment, err = s.repoComment.GetCommentByID(comment.ID); err != nil {
		return dto.CommentResponse{}, err
	}

	return dto.ConvertCommentToCommentResponse(comment), nil
}
