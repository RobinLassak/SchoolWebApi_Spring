package cz.schoolweb.service;

import cz.schoolweb.mapper.GradeMapper;
import cz.schoolweb.repository.GradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GradeService {

    GradeMapper gradeMapper;
    GradeRepository gradeRepository;

    @Autowired
    public GradeService(GradeMapper gradeMapper, GradeRepository gradeRepository) {
        this.gradeMapper = gradeMapper;
        this.gradeRepository = gradeRepository;
    }
}
