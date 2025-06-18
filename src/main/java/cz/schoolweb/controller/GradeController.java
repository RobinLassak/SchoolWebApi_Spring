package cz.schoolweb.controller;

import cz.schoolweb.mapper.GradeMapper;
import cz.schoolweb.service.GradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class GradeController {

    GradeService gradeService;
    GradeMapper gradeMapper;

    @Autowired
    public GradeController(GradeService gradeService, GradeMapper gradeMapper) {
        this.gradeService = gradeService;
        this.gradeMapper = gradeMapper;
    }
}
