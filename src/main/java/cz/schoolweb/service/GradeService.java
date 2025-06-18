package cz.schoolweb.service;

import cz.schoolweb.dto.GradeDto;
import cz.schoolweb.entity.GradeEntity;
import cz.schoolweb.mapper.GradeMapper;
import cz.schoolweb.repository.GradeRepository;
import cz.schoolweb.repository.StudentRepository;
import cz.schoolweb.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GradeService {

    GradeMapper gradeMapper;
    GradeRepository gradeRepository;
    SubjectRepository subjectRepository;
    StudentRepository studentRepository;

    @Autowired
    public GradeService(GradeMapper gradeMapper, GradeRepository gradeRepository,
                        SubjectRepository subjectRepository, StudentRepository studentRepository) {
        this.gradeMapper = gradeMapper;
        this.gradeRepository = gradeRepository;
        this.subjectRepository = subjectRepository;
        this.studentRepository = studentRepository;
    }
    //Zobrazeni vsech znamek - get
    public List<GradeDto> getAll(){
        List<GradeEntity> allGrades = gradeRepository.findAll();
        List<GradeDto> gradeDtos = new ArrayList<>();
        for (GradeEntity gradeEntity : allGrades) {
            gradeDtos.add(gradeMapper.toDto(gradeEntity));
        }
        return gradeDtos;
    }
}
