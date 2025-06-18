package cz.schoolweb.controller;

import cz.schoolweb.dto.GradeDto;
import cz.schoolweb.mapper.GradeMapper;
import cz.schoolweb.service.GradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    //Zobrazeni vsech znamek
    @GetMapping({"/grades", "/grades/"})
    public List<GradeDto> getAllGrades() {
        return gradeService.getAll();
    }
    //Pridavani novych znamek
    @PostMapping({"/grades", "/grades/"})
    public GradeDto addGrade(@RequestBody GradeDto gradeDto) {
        return gradeService.addGrade(gradeDto);
    }
}
