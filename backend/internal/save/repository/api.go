package repository

import (
	"github.com/google/uuid"
)

type SaveRepository interface {
	CheckIsSaved(PostID uuid.UUID, UserID uuid.UUID) (bool, error)
	GetTotalSaves(PostID uuid.UUID) (int64, error)
	CreateSave(PostID uuid.UUID, UserID uuid.UUID) error
	DeleteSave(PostID uuid.UUID, UserID uuid.UUID) error
} 
