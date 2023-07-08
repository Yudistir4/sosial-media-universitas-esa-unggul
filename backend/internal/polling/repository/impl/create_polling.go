package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *pollingRepository) CreatePolling(req dto.CreatePollingReq, tx *gorm.DB) (dto.Polling, error) {
	polling := dto.Polling{
		ID:          uuid.New(),
		UserID:      req.LoggedInUserID,
		IsPublic:    req.IsPublic,
		UseImage:    req.UseImage,
		Title:       req.Title,
		EndDate:     req.EndDate,
	}

	result := tx.Create(&polling)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Create Polling Error:", result.Error)
		return dto.Polling{}, customerrors.GetErrorType(result.Error)
	}
	return polling, nil
}
