package cz.schoolweb.mapper;

import cz.schoolweb.dto.StudentDto;
import cz.schoolweb.entity.StudentEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StudentMapper {
    StudentEntity toEntity(StudentDto studentDto);
    StudentDto toDto(StudentEntity studentEntity);
}
