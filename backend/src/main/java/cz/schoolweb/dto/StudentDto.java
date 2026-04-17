package cz.schoolweb.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentDto {
    private int Id;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
}
