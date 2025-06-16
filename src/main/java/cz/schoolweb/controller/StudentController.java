package cz.schoolweb.controller;

import cz.schoolweb.dto.StudentDto;
import cz.schoolweb.entity.StudentEntity;
import cz.schoolweb.mapper.StudentMapper;
import cz.schoolweb.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api")
public class StudentController {
    StudentService studentService;
    StudentMapper studentMapper;

    @Autowired
    public StudentController(StudentService studentService, StudentMapper studentMapper) {
        this.studentService = studentService;
        this.studentMapper = studentMapper;
    }
    //Zobrazeni vsech studentu
    @GetMapping({"/students", "/students/"})
    public List<StudentDto> getStudents() {
        return null;
    }
}
