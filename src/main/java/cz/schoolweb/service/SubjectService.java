package cz.schoolweb.service;

import cz.schoolweb.dto.StudentDto;
import cz.schoolweb.dto.SubjectDto;
import cz.schoolweb.entity.StudentEntity;
import cz.schoolweb.entity.SubjectEntity;
import cz.schoolweb.mapper.SubjectMapper;
import cz.schoolweb.repository.SubjectRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
public class SubjectService {
    SubjectMapper subjectMapper;
    SubjectRepository subjectRepository;

    @Autowired
    public SubjectService(SubjectMapper subjectMapper, SubjectRepository subjectRepository) {
        this.subjectMapper = subjectMapper;
        this.subjectRepository = subjectRepository;
    }
    //Zobrazeni vsech predmetu - get
    public List<SubjectDto> getSubjects(){
        List<SubjectEntity> subjectEntities = subjectRepository.findAll();
        List<SubjectDto> subjectDtos = new ArrayList<>();
        for(SubjectEntity subjectEntity : subjectEntities){
            subjectDtos.add(subjectMapper.toDto(subjectEntity));
        }
        return subjectDtos;
    }
    //Pridavani novych predmetu - post
    public SubjectDto addSubject(SubjectDto newSubjectDto){
        SubjectEntity subjectEntity = subjectMapper.toEntity(newSubjectDto);
        SubjectEntity savedSubject = subjectRepository.save(subjectEntity);
        return subjectMapper.toDto(savedSubject);
    }
}
