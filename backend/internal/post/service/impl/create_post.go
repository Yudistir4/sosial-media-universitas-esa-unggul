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
	post, err := s.repo.CreatePost(req)

	if err != nil {
		return dto.PostResponse{}, err
	}

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
