package dto

type UserType struct {
	Name string `gorm:"primary_key;type:varchar(255)"`
}
