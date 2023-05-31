package impl

import (
	"backend/pkg/dto"
)

func (r *commentRepository) GetComments(req dto.GetCommentsReq) ([]dto.Comment, error) {
	offset := (req.Page - 1) * req.Limit
	var comments []dto.Comment
	if err := r.db.Preload("User").Where("post_id = ?", req.PostID).Order("created_at asc").
		Limit(req.Limit).Offset(offset).Find(&comments).Error; err != nil {
		return []dto.Comment{}, err
	}

	return comments, nil
}
