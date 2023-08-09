package repository

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type SaveRepository interface {
	CheckIsSaved(PostID uuid.UUID, UserID uuid.UUID) (bool, error)
	GetTotalSaves(PostID uuid.UUID) (int64, error)
	CreateSave(req dto.PostAction) error
	DeleteSave(req dto.PostAction) error
	DeleteSaves(PostID uuid.UUID, tx *gorm.DB) error
	DeleteSavesRelatedToUser(UserID uuid.UUID, tx *gorm.DB) error
}
