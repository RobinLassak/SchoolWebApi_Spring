package cz.schoolweb.service;

import cz.schoolweb.dto.SubjectDto;
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
    //Editace predmetu - put
    public SubjectDto editSubject(SubjectDto editedSubjectDto, int subjectId){
        if(!subjectRepository.existsById(subjectId)){
            throw new EntityNotFoundException("Student not found");
        }
        SubjectEntity subjectEntity = subjectMapper.toEntity(editedSubjectDto);
        subjectEntity.setId(subjectId);
        SubjectEntity savedSubject = subjectRepository.save(subjectEntity);
        return subjectMapper.toDto(savedSubject);
    }
    //Mazani predmetu - delete
    public SubjectDto deleteSubject(int subjectId) {
        SubjectEntity subjectEntity = subjectRepository.findById(subjectId).orElseThrow(EntityNotFoundException::new);
        SubjectDto deletedSubjectToReturn = subjectMapper.toDto(subjectEntity);
        subjectRepository.delete(subjectEntity);
        return deletedSubjectToReturn;
    }
}
