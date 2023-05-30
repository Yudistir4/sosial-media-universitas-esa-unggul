package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
)

func (r *postRepository) CreatePost(req dto.CreatePostReq) (dto.Post, error) {
	post := dto.Post{
		ID:                  uuid.New(),
		UserID:              req.UserID,
		Caption:             req.Caption,
		ContentFileURL:      req.ContentFileURL,
		ContentType:         req.ContentType,
		PostCategory:        req.PostCategory,
		ContentFilePublicID: req.ContentFilePublicID,
	}

	result := r.db.Create(&post)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Create Post Error:", result.Error)
		return dto.Post{}, customerrors.GetErrorType(result.Error)
	}
	return post, nil
}
