package cz.schoolweb.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalDateTime;

@Entity(name = "Grade")
@Getter
@Setter
public class GradeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne   //N:1
    //@OneToMany //1:N
    //@OneToOne //1:1
    //@ManyToMany //M:N
    private StudentEntity student;

    @ManyToOne
    private SubjectEntity subject;
    private String topic;
    private int mark;
    private LocalDateTime date;
}
