package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"math/rand"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *postRepository) GetPosts(req dto.GetPostsReq) ([]dto.Post, error) {
	offset := (req.Page - 1) * req.Limit
	var posts []dto.Post

	if req.Saved {
		var saves []dto.Save
		err := r.db.Preload("Post").Preload("Post.User").Preload("Post.ToUser").Where("user_id = ?", req.LoggedInUserID).
			Limit(req.Limit).Offset(offset).Order("created_at desc").Find(&saves).Error

		if err != nil {
			if err == gorm.ErrRecordNotFound {
				return nil, customerrors.ErrPostNotFound
			}
			return nil, err
		}

		for _, save := range saves {
			posts = append(posts, save.Post)
		}
	} else {
		if req.Random == true {
			var count int64
			r.db.Model(&dto.Post{}).Not("content_file_url", "").Count(&count)
			offset = rand.Intn(int(count))
			if offset > 3 {
				offset -= 3
			}

		}

		query := r.db.Preload("User").Preload("ToUser").Limit(req.Limit).Offset(offset).Order("created_at desc")

		// search questions
		if req.ToUserID != uuid.Nil {
			// by to_user_id not_answer
			// by to_user_id popular
			if req.Popular == true {
				query = r.db.Preload("User").Preload("ToUser").Limit(req.Limit).Offset(offset).
					Order("COALESCE((SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id), 0) DESC").
					Where("to_user_id = ?", req.ToUserID)

			} else if req.NotAnswered == true {
				subQuery := r.db.Select("post_id").Where("user_id = ?", req.ToUserID).Table("comments")
				query = query.Where("to_user_id = ? AND id NOT IN (?)", req.ToUserID, subQuery)
			} else if req.Caption != "" {

				// by to_user_id caption
				query = query.Where("to_user_id = ? AND caption LIKE ?", req.ToUserID, "%"+req.Caption+"%")
			} else {

				// by to_user_id
				query = query.Where("to_user_id = ?", req.ToUserID)
			}

		} else {
			if req.Random == true {
				query = query.Not("content_file_url", "")
			} else if req.Caption != "" && req.PostCategory != "" && req.UserID != uuid.Nil {
				query = query.Where("caption LIKE ? AND post_category = ? AND user_id = ? AND post_category <> 'question'", "%"+req.Caption+"%", req.PostCategory, req.UserID)
			} else if req.Caption != "" && req.PostCategory != "" {
				// query = query.Where("caption LIKE ? AND post_category = ?", "%"+req.Caption+"%", req.PostCategory)
			} else if req.Caption != "" && req.UserID != uuid.Nil {
				query = query.Where("caption LIKE ? AND user_id = ? AND post_category <> 'question'", "%"+req.Caption+"%", req.UserID)
			} else if req.Caption != "" {
				query = query.Where("caption LIKE ? AND post_category <> 'question'", "%"+req.Caption+"%")
			} else if req.PostCategory != "" {
				query = query.Where("post_category = ?", req.PostCategory)
			} else if req.UserID != uuid.Nil {
				query = query.Where("user_id = ? AND post_category <> 'question'", req.UserID)
			}
		}

		err := query.Find(&posts).Error
		if err != nil {
			if err == gorm.ErrRecordNotFound {
				return nil, customerrors.ErrPostNotFound
			}
			return nil, err
		}
	}

	return posts, nil
}
