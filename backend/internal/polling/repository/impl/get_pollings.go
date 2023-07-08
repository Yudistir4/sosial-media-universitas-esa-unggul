package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *pollingRepository) GetPollings(req dto.GetPollingsReq) ([]dto.Polling, error) {
	offset := (req.Page - 1) * req.Limit
	var pollings []dto.Polling

	query := r.db.Preload("User").Preload("Options", func(db *gorm.DB) *gorm.DB {
		return db.Order("position ASC")
	}).Limit(req.Limit).Offset(offset).Order("created_at DESC")

	if req.UserID != uuid.Nil {
		query = query.Where("user_id = ?", req.UserID)
	}

	err := query.Find(&pollings).Error
	if err != nil {
		return []dto.Polling{}, err
	}
	return pollings, nil
}
