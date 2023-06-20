package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *postRepository) GetPostByID(ID uuid.UUID) (dto.Post, error) {

	var post dto.Post
	result := r.db.Preload("User").Preload("ToUser").First(&post, ID)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return dto.Post{}, customerrors.ErrPostNotFound
		}
		return dto.Post{}, result.Error
	}
	return post, nil
}
