# FE

ridaputrinuraida@mail.com
luqmannulhakim@mail.com
putupradipta@mail.com
organization39@mail.com
fasilkom@mail.com

## Important

1. add quisioner
   <!-- 1. ganti class diagram -->
   <!-- 2. ganti usecase dan tambah keterangan usecase -->
   <!-- 3. ganti foto ss dan tambah penjelasan mengenai chat -->

<!-- 4. tambah test case -->
<!-- 5. tambah analisa kebutuhan fungsional -->

<!-- 5. hamberger menu mobile (change email and password, saved post, logout) -->
<!-- 6. edit post -->
<!-- 1. Notiff -->
<!-- - edit profile pic -> update zustand -->
<!-- - forgot password page -->
<!-- - search post higlight caption -->
<!-- - search Q&A -->
<!-- - 404 Notfound user and post -->

<!-- 1. routing chat -->

2. fix UI
      <!-- 3. Find User (user item add user type.. and etc) -->
      <!-- 4. Link conversation user -->
      <!-- 5. fix last message -->
   <!-- 3. delete all chat when delete user -->
   <!-- 4. send message in profile -->
   <!-- 7. connect socket di Main -->
1. insight hasil polling

<!-- - total message unread -->

# Polling

<!-- - notif polling -->

- handle cannot vote if end_date times up in BE
- filtering student by faculty , year ,prodi
- total not yet answer
- add btn create post in profile post
- mark notif as read by id

5. Empty post -> make btn for 'create first post'
   <!-- - single polling page -->
   <!-- 6. bug btn -->
   <!-- - select voters
     -- get users voters
     -- get count user voters -->

<!-- - polling -->

<!-- - handle alumni -->
<!-- - bug when delete profile pic, avatar is gone -->
  <!-- 2. setting btn (change email and password) -->
   <!-- 7. crud Q&A -->
   <!-- 8. share link post -->

## Minor

- change 'update' -> 'edit'

<!-- 1. bug not revalidate updated profile when going profile orng lain -> home -> my profile -->

2. dark mode
<!-- 3. loading masing" components -->
3. fix routing
4. pause, mute global video

# BE

## important

<!-- 1. Chat -->
<!-- - email -->

<!-- - delete user
  -- delete all likes,comments and saves and notifications
  -- delete posts -->
  <!-- -- delete all -->
<!-- - deploy -->
<!-- - dummy data -->

<!-- 1. crud Q&A -->

# minor

- realtime notif
<!-- - delete user -> delete all post and etc... -->

<!-- page -->
<!-- 1. login page -->

<!-- 2. forgot password -->
   <!-- 3. beranda -->
   <!-- 11. search bar -->
   <!-- 7. notification -->
   <!-- 8. create post
3. create question
4. create polling -->
<!-- 4. setting - change email
5. setting - change password -->

<!-- 6. profile

- profile universitas
  -- tab post
  -- tab student
  -- tab lecturer
  -- tab organization
  -- tab faculty and study program
- profile faculty
- profile organisasi
- profile mahasiswa
- profile dosen -->

12. edit profile

    // Connect to the database server
    dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/?charset=utf8mb4&parseTime=True&loc=Local", params.Username, params.Password, params.Hostname, port)
    db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
    panic(err)
    }
    // Drop the database
    err = db.Exec("DROP DATABASE sosmed4").Error
    if err != nil {
    panic(err)
    }

    // Create the database
    result := db.Exec("CREATE DATABASE sosmed4")
    if result.Error != nil {
    panic(result.Error)
    }
