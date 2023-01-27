# learning platform
This project is based on an online learning application.
Over here in this project we are building a backend project.
This project will manage the whole system of this learning platform.

# Task
Task is to build course management system, where you will have to create three user roles, Super Admin, Admin and Employee, perform CRUD operation 

## Sign up - 
Create new Employee (name, email, password (encrypted), role )
By default, Employee

## Sign In - 
Sign in with email and password

## Admin - 
Create new course (title, description, video Url, topics array, duration, category, )
Update existing course (admin should able to add/delete part of the courses which potentially consists of pdfs, videos, and quizzes)
Delete Course

## Super Admin - 
Approve Created and updated course by admin (Note: Employee can only see course Approved by super Admin)

## Employee - 
View existing course (only if logged in and approved by super admin)
Use Token for login
Sort course category wise
Get rewards for progress/completion

## Hint
Hint:The Following Assignment Involves Authentication And Authorization For all routes/api’s. This will be based on a role key in the Employee Collection. So , hence you will also try to capture the role key in the JWT token.



# complete details of user
## Details
So first of all we have to create users.
Over here users have three different types.
    1. One is employee (students)
    2. Second is admin
    3. Third is super admin


An user can register using his / her name, email, password.
Email will be unique for each user.
An user will be in an inactive state after registering on the platform.
To activate the account he / she will have to verify the account, using the otp, which is sent on the email, at the registration time.
After verifying the otp user can login on the platform.


## Employee - 
An employee can’t create a course, can’t update a course, can’t delete a course, can’t approve a course.
An employee can only access (view) the course (approved) and the employee will be rewarded after successful viewing a course.
By default an employee will have zero reward and reward will increase, when this will view courses.


## Admin - 
An admin can create a course, can update a self created (approved) course, can delete a self created (approved) course.
An admin can view courses (approved), created by other admins also.
An admin can’t approve any courses.
An admin won’t have any reward.


## Super admin - 
A super admin can’t create any course.
Only a super admin can approve courses, created by an admin.
A super admin won’t have any reward.




# _____________________flow__________________ 
In the sequence of user creating and login, we have use three APIs 

### __1__ create a user
postapi -- '/register'
over we have to provide user's detils in request body to create a user.
data will look like -- 
```
{
	"name":"name",
	"email": "example@mail.com",
	"password": "sha1$8497e77f$1$c9dd67d7f9e75e278c",
	"role": "superAdmin"
}
```
## created user's data
In our user collenction a user's data will look like - 
 ```
 {
		"name": "name",
		"email": "example@mail.com",
		"password": "sha1$8497e77f$1$c9dd67d7f9e75e278c",
		"role": "superAdmin",
		"rewards": 0,
		"verified": false,
		"_id": "63d3b1539f1250c58e45bd0c",
		"createdAt": "2023-01-27T11:11:15.024Z",
		"updatedAt": "2023-01-27T11:11:15.024Z",
		"__v": 0
	}
```
### __2__ verify a user
post api -- '/verify'
over we have to provide user's detils in request body to verify a user.
data will look like -- 
```
{
	"email": "example@mail.com",
	"otp": XXXXXX
}
```
### __3__ login a user
post api -- '/login'
over we have to provide user's detils in request body to verify a user.
data will look like -- 
```
{
    "email": "example@mail.com",
	"password": "sha1$8497e77f$1$c9dd67d7f9e75e278c"
}
```




## _______________________________complete details of course__________________________
# Details
first of all an admin will create a course.
After creating a course, the course will be unapproved.
A super admin will approve this newly created course.
After approving a course by a super admin, the course will be visible on the platform, and can be accessible by a user.

# _____________________flow__________________ 
In the sequence of course creating, approval, view, update, delete, we have to user these APIs -

### __1__ create a course 
post api -- '/course'

An admin will  be able to create a course.
to create a course, course data will be provided inside request body.
data to create a course will look like - 
{
	"title": "course title",
	"description": "course description",
	"creator": "63d2a6af8d072dba83c84487",
	"duration": "24 hours",
	"topic": "css"
}

A course data, after creation, will look like - 
{
    "_id": "63d2a9ba87b879c5c5defa0f",
    "title": "first",
    "description": "description",
    "creator": "63d2a6af8d072dba83c84487",
    "topic": ["css"],
    "duration": "24 hours",
    "approved": false,
    "isDeleted": false,
    "createdAt": 2023-01-26T16:26:34.419+00:00,
    "updatedAt": 2023-01-26T17:10:45.337+00:00,
    "__v": 0
}

### __2__ approve a course
put api -- '/approve'

to approve a course super admin will have update the value of a key in course data, false to true.
approved course's data in collection will look like - 
{
    "_id": "63d2a9ba87b879c5c5defa0f",
    "title": "first",
    "description": "description",
    "creator": "63d2a6af8d072dba83c84487",
    "topic": ["css"],
    "duration": "24 hours",
    "approved": true,
    "isDeleted": false,
    "createdAt": 2023-01-26T16:26:34.419+00:00,
    "updatedAt": 2023-01-26T17:10:45.337+00:00,
    "__v": 0
}
### __3__ view a course by courseId
get api -- '/course/:courseId'

to fetch any course, user has to privide the courseId in path param.

### __4__ view all courses
get api -- '/courses'

to fetch all the courses, user has not to privide any filter over here.
in this case, user will get all courses, sorted in alphabatical order of title.

### __5__ update a course
put api -- '/course/:courseId'
### __6__ delete a course
delete api -- '/course/:courseId'


router.post('/course', authenticate, createCourse);
router.put('/approve/:courseId', authenticate, approveCourse);
router.get('/course/:courseId', authenticate, viewCourse);
router.get('/courses', authenticate, viewAllCourse);
router.put('/course/:courseId', authenticate, authorized, updateCourse);
router.delete('/course/:courseId', authenticate, authorized, deleteCourse);