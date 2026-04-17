export interface Student {
  id: number
  firstName: string
  lastName: string
  dateOfBirth: string
}

export interface StudentFormData {
  firstName: string
  lastName: string
  dateOfBirth: string
}

export interface Subject {
  id: number
  name: string
}

export interface SubjectFormData {
  name: string
}

export interface Grade {
  id: number
  student: Student
  subject: Subject
  studentId: number
  subjectId: number
  topic: string
  mark: number
  date: string
}

export interface GradeFormData {
  studentId: number
  subjectId: number
  topic: string
  mark: number
  date: string
}

export type GradeMark = 1 | 2 | 3 | 4 | 5
