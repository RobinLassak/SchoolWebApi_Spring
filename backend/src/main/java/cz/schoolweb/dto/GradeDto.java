package cz.schoolweb.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GradeDto {

    private int id;
    //pro nasi vizualni kontolu - neni bezpodminecne nutne
    private StudentDto student;
    private SubjectDto subject;
    //pro pridani cizich klicu - nutne pro manipulaci s tabulkou v db
    private int studentId;
    private int subjectId;
    private String topic;
    private int mark;
    private LocalDateTime date;
}
