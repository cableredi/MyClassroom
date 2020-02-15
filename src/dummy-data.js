export default {
  "users": [
    {
      "user_id": 1,
      "full_name": "MS. Teacher",
      "role": "Teacher",
      "user_name": "teacher",
      "password": "teacher",
    },
    {
      "user_id": 2,
      "full_name": "",
      "role": "Student",
      "user_name": "student",
      "password": "student",
    }
  ],
  "classes": [
    {
      "class_id": 1,
      "class_name": "Math 101",
      "user_id": 1
    },
    {
      "class_id": 2,
      "class_name": "English 101",
      "user_id": 1
    },
  ],
  "assignments": [
    {
      "assignment_id": 1,
      "class_name": "Math 101",
      "due_date": new Date('02/08/2020'),
      "title": 'Math Page 13',
      "notes": 'All Questions',
      "category": 'homework',
    },
    {
      "assignment_id": 2,
      "class_name": "English 101",
      "due_date": new Date('02/08/2020'),
      "title": 'Test',
      "notes": 'Chapter 3',
      "category": 'test',
    },
    {
      "assignment_id": 3,
      "class_name": "Math 101",
      "due_date": new Date('02/8/2020'),
      "title": 'Math page 46',
      "notes": 'Questions 1 - 15',
      "category": 'homework',
    },
    {
      "assignment_id": 4,
      "class_name": "Math 101",
      "due_date": new Date('02/11/2020'),
      "title": 'Math page 50',
      "notes": 'Questions 1 - 15',
      "category": 'homework',
    }
  ]
}