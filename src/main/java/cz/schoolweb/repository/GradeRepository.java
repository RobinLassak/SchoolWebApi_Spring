package cz.schoolweb.repository;

import cz.schoolweb.entity.GradeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GradeRepository extends JpaRepository<GradeEntity, Integer> {
}
