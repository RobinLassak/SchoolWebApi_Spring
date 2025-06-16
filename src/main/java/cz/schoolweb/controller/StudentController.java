package cz.schoolweb.controller;

import cz.schoolweb.dto.StudentDto;
import cz.schoolweb.entity.StudentEntity;
import cz.schoolweb.mapper.StudentMapper;
import cz.schoolweb.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
        return studentService.getStudents();
    }
    //Pridavani novych studentu
    @PostMapping({"/students", "/students/"})
    public StudentDto addStudent(@RequestBody  StudentDto studentToAdd) {
        return studentService.addStudent(studentToAdd);
    }
    //Editace studentu
    @PutMapping("/students/{studentsId}")
    public StudentDto editStudent(@PathVariable int studentsId, @RequestBody StudentDto editedStudent) {
        return  studentService.editStudent(editedStudent, studentsId);  
    }
}
