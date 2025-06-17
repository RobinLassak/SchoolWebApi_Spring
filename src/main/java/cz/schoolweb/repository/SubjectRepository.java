package cz.schoolweb.repository;

import cz.schoolweb.entity.SubjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubjectRepository extends JpaRepository<SubjectEntity, Integer> {
}
