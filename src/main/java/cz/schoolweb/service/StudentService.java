package cz.schoolweb.service;

import cz.schoolweb.dto.StudentDto;
import cz.schoolweb.entity.StudentEntity;
import cz.schoolweb.mapper.StudentMapper;
import cz.schoolweb.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StudentService {
    StudentMapper studentMapper;
    StudentRepository studentRepository;

    @Autowired
    public StudentService(StudentMapper studentMapper, StudentRepository studentRepository) {
        this.studentMapper = studentMapper;
        this.studentRepository = studentRepository;
    }
    //Zobrazeni vsech studentu - get
    public List<StudentDto> getStudents(){
        List<StudentEntity> studentEntities = studentRepository.findAll();
        List<StudentDto> studentDtos = new ArrayList<>();
        for(StudentEntity studentEntity : studentEntities){
            studentDtos.add(studentMapper.toDto(studentEntity));
        }
        return studentDtos;
    }
    //Pridavani novych studentu
    public StudentDto addStudent(StudentDto newStudentDto){
        StudentEntity studentEntity = studentMapper.toEntity(newStudentDto);
        StudentEntity savedStudent = studentRepository.save(studentEntity);
        return studentMapper.toDto(savedStudent);
    }
}
