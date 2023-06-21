package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *postRepository) CreatePost(req dto.CreatePostReq, tx *gorm.DB) (dto.Post, error) {
	post := dto.Post{
		ID:                  uuid.New(),
		UserID:              req.UserID,
		Caption:             req.Caption,
		ContentFileURL:      req.ContentFileURL,
		ContentType:         req.ContentType,
		PostCategory:        req.PostCategory,
		ContentFilePublicID: req.ContentFilePublicID,
	}
	if req.ToUserID != uuid.Nil {
		post.ToUserID = &req.ToUserID
	}

	result := tx.Create(&post)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Create Post Error:", result.Error)
		return dto.Post{}, customerrors.GetErrorType(result.Error)
	}
	return post, nil
}
