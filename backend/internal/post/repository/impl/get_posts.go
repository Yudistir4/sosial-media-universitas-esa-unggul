package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *postRepository) GetPosts(req dto.GetPostsReq) ([]dto.Post, error) {
	offset := (req.Page - 1) * req.Limit
	var posts []dto.Post
	query := r.db.Preload("User").Limit(req.Limit).Offset(offset).Order("created_at desc")

	if req.Caption != "" && req.PostCategory != "" && req.UserID != uuid.Nil {
		query = query.Where("caption LIKE ? AND post_category = ? AND user_id = ?", "%"+req.Caption+"%", req.PostCategory, req.UserID)
	} else if req.Caption != "" && req.PostCategory != "" {
		query = query.Where("caption LIKE ? AND post_category = ?", "%"+req.Caption+"%", req.PostCategory)
	} else if req.Caption != "" {
		query = query.Where("caption LIKE ?", "%"+req.Caption+"%")
	} else if req.PostCategory != "" {
		query = query.Where("post_category = ?", req.PostCategory)
	} else if req.UserID != uuid.Nil {
		query = query.Where("user_id = ?", req.UserID)
	}

	result := query.Find(&posts)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, customerrors.ErrPostNotFound
		}
		return nil, result.Error
	}
	return posts, nil
}
