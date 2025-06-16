package cz.schoolweb.service;

import cz.schoolweb.mapper.StudentMapper;
import cz.schoolweb.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentService {
    StudentMapper studentMapper;
    StudentRepository studentRepository;

    @Autowired
    public StudentService(StudentMapper studentMapper, StudentRepository studentRepository) {
        this.studentMapper = studentMapper;
        this.studentRepository = studentRepository;
    }
}
