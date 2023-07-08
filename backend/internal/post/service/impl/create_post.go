package impl

import (
	"backend/pkg/dto"
	"backend/pkg/utils/cloudinaryutils"
	"context"
)

func (s *postService) CreatePost(req dto.CreatePostReq) (dto.PostResponse, error) {

	// Upload File if exist
	if req.ContentFileSrc != "" {
		result, err := cloudinaryutils.UploadFile(cloudinaryutils.UploadParams{Ctx: context.Background(), FilePath: req.ContentFileSrc, Cld: s.claudinary})
		if err != nil {
			return dto.PostResponse{}, err
		}
		req.ContentFileURL = result.FileURL
		req.ContentFilePublicID = result.PublicID
	}
	tx := s.db.Begin()
	post, err := s.repo.CreatePost(req,tx)

	if err != nil {
		tx.Rollback()
		return dto.PostResponse{}, err
	}

	if req.PostCategory == "question" {
		createNotif := dto.CreateNotificationReq{
			FromUserID: req.UserID,
			ToUserID:   req.ToUserID,
			PostID:     &post.ID,
			Activity:   "ask",
		}
		if err = s.repoNotification.CreateNotification(createNotif, tx); err != nil {
			tx.Rollback()
			return dto.PostResponse{}, err
		}
	}

	tx.Commit()

	post, err = s.repo.GetPostByID(post.ID)
	if err != nil {
		return dto.PostResponse{}, err
	}

	postResponse := dto.PostResponse{
		ID:             post.ID,
		CreatedAt:      post.CreatedAt,
		UpdatedAt:      post.UpdatedAt,
		Caption:        post.Caption,
		ContentFileURL: post.ContentFileURL,
		ContentType:    post.ContentType,
		PostCategory:   post.PostCategory,
		User: dto.PostUserResponse{
			ID:            post.User.ID,
			Name:          post.User.Name,
			ProfilePicURL: post.User.ProfilePicURL,
		},
	}

	return postResponse, nil
}
