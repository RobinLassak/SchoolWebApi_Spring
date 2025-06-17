package cz.schoolweb.controller;

import cz.schoolweb.dto.StudentDto;
import cz.schoolweb.dto.SubjectDto;
import cz.schoolweb.mapper.SubjectMapper;
import cz.schoolweb.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SubjectController {

    SubjectService subjectService;
    SubjectMapper subjectMapper;

    @Autowired
    public SubjectController(SubjectService subjectService, SubjectMapper subjectMapper) {
        this.subjectService = subjectService;
        this.subjectMapper = subjectMapper;
    }
    //Zobrazeni vsech predmetu
    @GetMapping({"/subjects", "/subjects/"})
    public List<SubjectDto> getSubjects() {
        return subjectService.getSubjects();
    }
    //Pridavani novych predmetu
    @PostMapping({"/subjects", "/subjects/"})
    public SubjectDto addSubject(@RequestBody  SubjectDto subjectToAdd) {
        return subjectService.addSubject(subjectToAdd);
    }
}
