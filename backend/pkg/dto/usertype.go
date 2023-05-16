package dto

import "github.com/google/uuid"

type UserType struct {
	ID   uuid.UUID
	Name string
}
