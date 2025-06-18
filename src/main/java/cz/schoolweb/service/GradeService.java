package cz.schoolweb.service;

import cz.schoolweb.mapper.GradeMapper;
import cz.schoolweb.repository.GradeRepository;
import cz.schoolweb.repository.StudentRepository;
import cz.schoolweb.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
