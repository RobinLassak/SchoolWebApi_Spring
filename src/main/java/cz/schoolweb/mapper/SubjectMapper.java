package cz.schoolweb.mapper;

import cz.schoolweb.dto.SubjectDto;
import cz.schoolweb.entity.SubjectEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SubjectMapper {

    SubjectEntity toEntity(SubjectDto subjectDto);
    SubjectDto toDto(SubjectEntity subjectEntity);
}
